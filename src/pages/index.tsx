import React, { useEffect, useMemo, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, makeStyles, TextField, Typography, InputAdornment, Tooltip, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { Check as CheckIcon, ExpandMore } from "@material-ui/icons";

import { validateUrl, validateUrlCode } from "../utils/validator";

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
  form: {
    padding: theme.spacing(4),
    width: '50%',
    background: '#ffffff',
    boxShadow: '12px 12px 16px 0 #E8E8FA, -8px -8px 12px 0 rgb(255 255 255 / 30%)',
    borderRadius: '24px',
  },
  heading: {
    padding: "16px 0px",
    color: "#3E369C",
    fontSize: "64px",
    fontWeight: 600,
  },
  accordion: {
    border: 'none',
    boxShadow: 'none',
  },
  accordionComponent: {
    padding: "0"
  },
  subheading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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
      <Typography className={classes.subheading} style={{ margin: "16px"}}>
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
    <div className={classes.root}>
      <Typography variant="h5" className={classes.heading}>
        Create Short Links!
      </Typography>
      <Typography className={classes.subheading} style={{ paddingBottom: "32px"}}>
        This is a custom short link personalization tool provided by Vietcode Organization that enables you to target, engage, and drive more visitors. Get started now.
      </Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit} className={classes.form}>
        <TextField
          id="outlined-required"
          label="Long URL"
          name="longUrl"
          variant="outlined"
          placeholder="Paste a link to shorten it"
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
          {loading ? "Loading..." : "Continue"}
        </Button>
        <div>
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classes.accordionComponent}
            >
              <Typography className={classes.subheading}>More options</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionComponent}>
              <TextField
                id="outlined-required"
                label="Custom URL Ending"
                name="urlCode"
                variant="outlined"
                placeholder="an_example_ending"
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
            </AccordionDetails>
          </Accordion>
        </div>
      </form>
      {data 
        ? <ShortUrlComponent />
        : ""
      }
    </div>
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
