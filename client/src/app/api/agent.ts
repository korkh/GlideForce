import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";
import { FieldValues } from "react-hook-form";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true; //to serve cookies same as in API

const responseBody = (response: AxiosResponse) => response.data;

// Checking Headers for Authorization (Bearer Token)
axios.interceptors.request.use((config) => {
  // try to get token
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Pagination interceptor
axios.interceptors.response.use(
  async (response) => {
    if (import.meta.env.DEV) await sleep();
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      // Handle network errors or unexpected errors.
      // You can log or handle them as per your requirements.
      console.error("Network error or unexpected error:", error.message);
      return Promise.reject(error);
    }

    const { data, status } = error.response as AxiosResponse;

    switch (status) {
      case 400: //validation errors handling
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          return Promise.reject(modelStateErrors);
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 403:
        toast.error("You are not allowed to do that!");
        break;
      case 500:
        toast.error("Internal Server error!");
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        toast.error(`Unhandled status code: ${status}`);
        console.error("Unhandled status code:", status);
        break;
    }

    return Promise.reject(error);
  }
);

function createFormData(item: FieldValues) {
  const formData = new FormData();

  for (const key in item) {
    formData.append(key, item[key])
  }
  return formData;
}

const requests = {
  get: <T>(url: string, params?: URLSearchParams) =>
    axios.get<T>(url, { params }).then(responseBody),
  post: <T>(url: string, body: object) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) =>
    axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
  postForm: <T>(url: string, data: FormData) =>
    axios
      .post<T>(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  putForm: <T>(url: string, data: FormData) =>
    axios
      .put<T>(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
};

const Catalog = {
  list: (params?: URLSearchParams) => requests.get("products", params),
  details: (id: number) => requests.get(`products/${id}`),
  fetchFilters: () => requests.get("products/filters"),
};

const TestErrors = {
  get400Error: () => requests.get("error/bad-request"),
  get401Error: () => requests.get("error/unauthorised"),
  get404Error: () => requests.get("error/not-found"),
  get500Error: () => requests.get("error/server-error"),
  getValidationError: () => requests.get("error/validation-error"),
};

const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number | undefined, quantity = 1) =>
    requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number | undefined, quantity = 1) =>
    requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const Account = {
  login: (values: object) => requests.post("account/login", values),
  register: (values: object) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
  fetchAddress: () => requests.get("account/savedAddress"),
};

const Orders = {
  list: () => requests.get("orders"),
  fetch: (id: number) => requests.get(`orders/${id}`),
  create: (values: object) => requests.post("orders", values),
};

const Payments = {
  createPaymentIntent: () => requests.post("payments", {}),
};

const Admin = {
  createProduct: (product: FieldValues) =>
    requests.postForm("products", createFormData(product)),
  updateProduct: (product: FieldValues) =>
    requests.putForm("products", createFormData(product)),
  deleteProduct: (id: number) => requests.delete(`products/${id}`),
};

const agent = {
  Catalog,
  TestErrors,
  Basket,
  Account,
  Orders,
  Payments,
  Admin,
};

export default agent;
