import { useState } from "react";
import {
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonsGroup";
import useProducts from "../../app/hooks/useProducts";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setPageNumber, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to high" },
];

export default function Catalog() {
  const { products, brands, types, filtersLoaded, metaData } = useProducts();
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      event.preventDefault();
      setExpanded(newExpanded ? panel : false);
    };

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;

  return (
    <Grid
      container
      columnSpacing={4}
      rowSpacing={isMobile ? 2 : 0}
      sx={{ mt: 2 }}
    >
      {
        !isMobile && (
          <>
            <Grid item xs={12} sm={isMobile ? 12 : 3} order={isMobile ? 2 : 1}>
              <Paper sx={{ mb: 2 }}>
                <ProductSearch />
              </Paper>
              <Paper sx={{ p: 2, mb: 2 }}>
                <RadioButtonGroup
                  selectedValue={productParams.orderBy}
                  options={sortOptions}
                  onChange={(e) =>
                    dispatch(setProductParams({ orderBy: e.target.value }))
                  }
                />
              </Paper>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Brands</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CheckboxButtons
                    items={brands}
                    checked={productParams.brands}
                    onChange={(checkedItems: string[]) =>
                      dispatch(setProductParams({ brands: checkedItems }))
                    }
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Types</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CheckboxButtons
                    items={types}
                    checked={productParams.types}
                    onChange={(checkedItems: string[]) =>
                      dispatch(setProductParams({ types: checkedItems }))
                    }
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </>
        )
      }
      <Grid item xs={12} sm={isMobile ? 12 : 9} order={isMobile ? 1 : 2}>
        {isMobile && (
          <Paper sx={{ mb: 2 }}>
            <ProductSearch />
          </Paper>
        )}
        {isMobile && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <RadioButtonGroup
              selectedValue={productParams.orderBy}
              options={sortOptions}
              onChange={(e) =>
                dispatch(setProductParams({ orderBy: e.target.value }))
              }
            />
          </Paper>
        )}
        {isMobile && (
          <>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Brands</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CheckboxButtons
                  items={brands}
                  checked={productParams.brands}
                  onChange={(checkedItems: string[]) =>
                    dispatch(setProductParams({ brands: checkedItems }))
                  }
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Types</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CheckboxButtons
                  items={types}
                  checked={productParams.types}
                  onChange={(checkedItems: string[]) =>
                    dispatch(setProductParams({ types: checkedItems }))
                  }
                />
              </AccordionDetails>
            </Accordion>
          </>
        )}
        <ProductList products={products} />
        {metaData && (
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          />
        )}
      </Grid>
    </Grid>
  );
}
