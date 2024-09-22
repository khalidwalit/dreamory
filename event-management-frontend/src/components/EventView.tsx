import React, { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid2 as Grid,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  CircularProgress,
} from "@mui/material";
import useEventQueries from "../hooks/useEventQueries";

const EventView = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
  } = useEventQueries().useFetchEvents(page, limit);

  if (!events || events.length === 0) {
    return <div>No events found.</div>;
  }

  if (eventsLoading) {
    return <CircularProgress />;
  }

  if (eventsError) {
    return <div>Error loading events: {eventsError.message}</div>;
  }

  const getCoffeMakerCard = (coffeMakerObj: any) => {
    const { name, status, thumbnail } = coffeMakerObj;

    return (
      <Grid>
        <Card>
          <CardHeader
            // avatar={<Avatar />}
            action={
              <IconButton aria-label="settings">
                {/* <ShareIcon /> */}
              </IconButton>
            }
            title={name}
            subheader={name}
          />
          <CardMedia
            style={{ height: "150px" }}
            image={
              "https://zartnerds.files.wordpress.com/2015/10/thumbnail.png"
            }
          />
          <CardContent>
            <Typography variant="body2" component="p">
              {status}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">BUY NOW</Button>
            <Button size="small">OFFER</Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };
  return (
    <div>
      <Grid container direction="column">
        <Grid container>
          <Grid />
          <Grid>
            <Grid container spacing={2}>
              {events.map((coffeMakerObj) => getCoffeMakerCard(coffeMakerObj))}
            </Grid>
          </Grid>
          <Grid />
        </Grid>
      </Grid>
    </div>
  );
};

export default EventView;
