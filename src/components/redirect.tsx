import React from "react";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export default function RedirectPage() {
  let { urlCode } = useParams() as any;

  const { data, loading, error } = useQuery(URL_QUERY, {
    variables: {
      urlCode: urlCode,
    },
  });

  if (!urlCode) return 'You need a valid url path';
  if (loading) return null;
  if (error) return `Error! ${error.message}`;
  return (
    <h1>See data {console.log(data)}</h1>
  )
}

const URL_QUERY = gql`
  query ($urlCode: String!) {
    getUrl(urlCode: $urlCode)
  }
`;
