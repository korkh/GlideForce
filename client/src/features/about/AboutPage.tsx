import React from "react";
import { Grid, Typography, Paper, List, ListItem } from "@mui/material";

const AboutUsPage: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={9} sm={9}>
        <Typography variant="h1" component="h1">
          About us
        </Typography>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse molestie consequat, vel illum dolore eu feugiat nulla
            facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugait
            nulla facilisi. Nam liber tempor cum soluta nobis eleifend option
            congue nihil imperdiet doming id quod mazim placerat facer possim
            assum. Typi non habent claritatem insitam; est usus legentis in iis
            qui facit eorum claritatem. Investigationes demonstraverunt lectores
            legere me lius quod ii legunt saepius. Claritas est etiam processus
            dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est
            notare quam littera gothica, quam nunc putamus parum claram,
            anteposuerit litterarum formas humanitatis per seacula quarta decima
            et quinta decima. Eodem modo typi, qui nunc nobis videntur parum
            clari, fiant sollemnes in futurum.
          </Typography>
          {/* Other content */}
          <Typography variant="h2" component="h2">
            Lorem ipsum dolor sit amet
          </Typography>
          <Typography variant="body1">{/* Other content */}</Typography>
          <Typography variant="h3" component="h3">
            Investigationes demonstraverunt
          </Typography>
          <List>
            <ListItem>Lorem ipsum dolor sit amet</ListItem>
            {/* Other list items */}
          </List>
          <Typography variant="body1">{/* Remaining content */}</Typography>
          <Typography variant="h2" component="h2">
            Nam liber tempor cum soluta nobis
          </Typography>
          <Typography variant="body1">{/* Remaining content */}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AboutUsPage;
