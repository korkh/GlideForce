import * as yup from 'yup';
import { FieldValues } from 'react-hook-form';

export const validationSchema: yup.ObjectSchema<FieldValues> = yup.object().shape({
    name: yup.string().required(),
    brand: yup.string().required(),
    type: yup.string().required(),
    price: yup.number().required().moreThan(100),
    quantityInStock: yup.number().required().min(0),
    description: yup.string().required(),
    file: yup.mixed().when('pictureUrl', {
        is: (value: string) => !value,
        then: schema => schema.required("Please provide an image"),
        otherwise: schema => schema.notRequired()
    })
});
