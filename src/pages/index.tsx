import React, { useEffect, useMemo, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, makeStyles, TextField, Typography, InputAdornment, Tooltip } from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";

import { validateUrl, validateUrlCode } from "../utils/validator";

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '50%',
    },
  },
  label: {
    marginBottom: "8px",
    marginTop: "16px",
  },
  tick: {
    fontSize: "15px",
    color: "#532BDC",
  },
  submit: {
    margin: theme.spacing(2, 0),
    borderRadius: "6px",
  },
}));

interface IInput {
  urlCode?: string,
  longUrl: string
}

const initInput = {
  longUrl: "",
  urlCode: ""
}

export default function HomePage() {
  const classes = useStyles();
  const [input, setInput] = useState<IInput>(initInput);
  const [shortUrl, setShortUrl] = useState<string>();
  const [createUrl, { data, loading, error }] = useMutation(CREATEURL_MUTATION);

  const valid = useMemo(() => {
    const longUrl = validateUrl(input.longUrl);
    if (input.urlCode) {
      let urlCode = validateUrlCode(input.urlCode)
      return {
        longUrl,
        urlCode
      }
    }
    return {
      longUrl,
    };
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.urlCode === "") {
      delete input.urlCode
    }

    await createUrl({
      variables: input
    })
  }

  useEffect(() => {
    if (data) {
      setInput(initInput)
      if (process.env.NODE_ENV === "development") {
        setShortUrl(`http://localhost:3000/${data.createUrl.urlCode}`)
      } else {
        setShortUrl(`https://shorten.vietcode.org/${data.createUrl.urlCode}`)
      }
    }

    if (error) {
      console.log(error.message);
    }
  }, [data, error]);

  const ShortUrlComponent = () => {
    const [copiedText, setCopiedText] = useState<string>();

    const onCopy = () => {
      setCopiedText(shortUrl)
      navigator.clipboard.writeText(shortUrl)
    }

    return (
      <Typography className={classes.label}>
        Your shorten URL is: 
        <Tooltip
          title={
            copiedText === shortUrl
              ? "Copied!"
              : "Copy To Clipboard"
          }
          placement="top"
        >
          <Button onClick={onCopy}>
            {shortUrl}
          </Button>
        </Tooltip>
      </Typography>
    )
  }

  return (
    <>
      <Typography variant="h5" className={classes.label}>
        Long URL
      </Typography>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          id="outlined-required"
          name="longUrl"
          variant="outlined"
          placeholder="Enter your long url here."
          required={true}
          fullWidth
          value={input.longUrl}
          error={input.longUrl !== "" ? !valid.longUrl : false}
          InputProps={
            valid.longUrl && {
              endAdornment: (
                <InputAdornment position="start">
                  <CheckIcon className={classes.tick} />
                </InputAdornment>
              ),
            }
          }
          onChange={handleChange}
        />
        <div>
          <TextField
            id="outlined-required"
            name="urlCode"
            variant="outlined"
            placeholder="Enter your custom url path."
            fullWidth
            value={input.urlCode}
            error={input.urlCode && input.urlCode !== "" ? !valid.urlCode : false}
            InputProps={
              valid.urlCode && {
                endAdornment: (
                  <InputAdornment position="start">
                    <CheckIcon className={classes.tick} />
                  </InputAdornment>
                ),
              }
            }
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={
            !Object.values(valid).reduce((acc, cur) => acc && cur, true) ||
            loading ||
            data
          }
          size="large"
        >
          {loading ? "Loading..." : "Tiếp tục"}
        </Button>
      </form>
      {data 
        ? <ShortUrlComponent />
        : ""
      }
    </>
  )
}

const CREATEURL_MUTATION = gql`
  mutation (
    $urlCode: String
    $longUrl: String!
  ) {
    createUrl(
      input: {
        urlCode: $urlCode
        longUrl: $longUrl
      }
    ) {
      urlCode
    }
  }
`;
