import React, { useEffect } from "react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

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

  if (!urlCode) return 'You need to enter a valid url path';
  if (loading) return null;
  if (error) return `Error! ${error.message}`;
  return (
    <h1>Going to redirect...</h1>
  )
}

const URL_QUERY = gql`
  query ($urlCode: String!) {
    getUrl(urlCode: $urlCode)
  }
`;
