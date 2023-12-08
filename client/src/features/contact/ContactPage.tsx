import { Button, Grid, Paper, TextField, Typography } from "@mui/material";

const ContactPage = () => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={9} sm={9}>
        <Typography variant="h1" component="h1" gutterBottom>
          Contact
        </Typography>
        <Paper sx={{ p: 2, mt: 2 }}>
          {/* Google Maps Component */}
          <div id="map" style={{ height: "200px", marginBottom: "40px" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus illum fugit culpa voluptas, animi saepe itaque debitis? Sapiente voluptatibus totam ratione commodi nostrum id vitae harum voluptatem vero assumenda sed facilis eveniet, veniam reiciendis alias autem suscipit, culpa cumque. Recusandae reprehenderit esse delectus quo! Earum tempore necessitatibus tenetur soluta id! Accusantium sunt perspiciatis reiciendis. Ut eaque quia nesciunt mollitia optio, tenetur dignissimos autem in, error alias ex aperiam doloremque necessitatibus iste debitis! Odio nisi iusto nihil voluptates obcaecati architecto repellat, cum accusamus. Rerum nobis corrupti assumenda unde voluptatibus enim eos temporibus minima voluptatem architecto ipsam molestias, pariatur aut consequatur deleniti.
          </div>

          <Typography variant="h2" component="h2" gutterBottom>
            Contact Form
          </Typography>
          <Typography variant="body1" gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut wisi
            enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          </Typography>

          <form action="#" style={{ marginTop: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={8}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContactPage;
