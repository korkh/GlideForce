import { useState } from "react";
import { ShoppingCart, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { BasketItem } from "../models/basket";
import SignedInMenu from "./SignedInMenu";
import { useAppSelector } from "../store/configureStore";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  "&:hover": {
    color: "grey.500",
  },
  "&.active": {
    color: "text.secondary",
  },
};

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export default function Header({ handleThemeChange, darkMode }: Props) {
  const { basket } = useAppSelector((state) => state.basket);
  const { user } = useAppSelector((state) => state.account);
  const itemCount = basket?.items.reduce(
    (sum: number, item: BasketItem) => sum + item.quantity,
    0
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          {isMobile ? ( // Hamburger menu icon for mobile
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerOpen}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Typography variant="h6" component={NavLink} to="/" sx={navStyles}>
              GlideForce
            </Typography>
          )}
          <Switch
            checked={darkMode}
            onChange={handleThemeChange}
            defaultChecked
          />
        </Box>

        {!isMobile && ( // Show midLinks on non-mobile screens
          <List sx={{ display: "flex" }}>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
            {user && user.roles?.includes("Admin") && (
              <ListItem component={NavLink} to={"/inventory"} sx={navStyles}>
                INVENTORY
              </ListItem>
            )}
          </List>
        )}

        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <SignedInMenu />
          ) : (
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Drawer for mobile */}
        <Drawer anchor="left" open={openDrawer} onClose={handleDrawerClose}>
          <List>
            {midLinks.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={path}
                sx={navStyles}
                onClick={handleDrawerClose}
              >
                {title.toUpperCase()}
              </ListItem>
            ))}
            {user && user.roles?.includes("Admin") && (
              <ListItem
                component={NavLink}
                to={"/inventory"}
                sx={navStyles}
                onClick={handleDrawerClose}
              >
                INVENTORY
              </ListItem>
            )}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
