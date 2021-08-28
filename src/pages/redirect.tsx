import React, { useEffect } from "react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    background: 'linear-gradient(150deg, #E3E1F8 0%, rgba(255,255,255,1) 100%);',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: [
      "CircularStd",
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  heading: {
    padding: "16px 0px",
    color: "#3E369C",
    fontSize: "32px",
    fontWeight: 600,
  },
}));

export default function RedirectPage() {
  let { urlCode } = useParams() as any;
  const classes = useStyles();

  const { data, loading, error } = useQuery(URL_QUERY, {
    variables: {
      urlCode: urlCode,
    },
  });

  useEffect(() => {
    if (data) {
      window.location = data.getUrl
    }
  }, [urlCode, data])

  if (loading) return null;
  if (error) return (
    <div className={classes.root}>
      <Typography className={classes.heading} style={{ color: 'red' }}>
        Error! {error.message}
      </Typography>
    </div>
  );
  return (
    <div className={classes.root}>
      <Typography className={classes.heading}>
        Going to redirect...
      </Typography>
    </div>
  )
}

const URL_QUERY = gql`
  query ($urlCode: String!) {
    getUrl(urlCode: $urlCode)
  }
`;
