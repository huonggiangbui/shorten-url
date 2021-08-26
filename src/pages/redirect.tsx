import React, { useEffect } from "react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";

export default function RedirectPage() {
  let { urlCode } = useParams() as any;

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
    <Typography variant="h5">
      Error! {error.message}
    </Typography>
  );
  return (
    <Typography variant="h5">
      Going to redirect...
    </Typography>
  )
}

const URL_QUERY = gql`
  query ($urlCode: String!) {
    getUrl(urlCode: $urlCode)
  }
`;
