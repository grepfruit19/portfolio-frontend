import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useForm } from "react-hook-form";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Handles rendering of a graph based on a given state
function Graph(props) {
  const { graphType } = props;
  const { register, watch } = useForm({
    defaultValues: {
      startDate: "2021-01-01",
      endDate: "2022-01-31",
    },
  });
  const [data, setData] = useState([]);
  // Key used for the X axis
  const [xKey, setXKey] = useState("date");
  const [barKey, setBarKey] = useState("daily_vaccinations");
  // Maximum value of Y axis
  const [yMax, setYMax] = useState(100000);

  const watchAllValues = watch();

  // Takes in an array of objects, and a given key, and gets the highest value
  const getHighestValue = (input, key) => {
    let highest = 0;
    input.forEach((element) => {
      if (Number(element[key]) > highest) {
        highest = Number(element[key]);
      }
    });
    return highest;
  };

  // Handles data fetching based on graph type.
  useEffect(() => {
    if (graphType === 0) {
      async function fetchData() {
        let res;
        try {
          res = await axios({
            method: "get",
            url: `${BACKEND_URL}/vaccinations/daily`,
            params: {
              start_date: watchAllValues.startDate,
              end_date: watchAllValues.endDate,
            },
          });
          setXKey("date");
          setBarKey("daily_vaccinations");
          setYMax(getHighestValue(res.data, "daily_vaccinations"));
        } catch (err) {
          console.log(err);
        }
        setData(res.data);
      }
      fetchData();
    } else if (graphType === 1) {
      async function fetchData() {
        let res;
        try {
          res = await axios({
            method: "get",
            url: `${BACKEND_URL}/vaccinations/by-state`,
          });
          setXKey("location");
          setBarKey("people_fully_vaccinated_per_hundred");
          setYMax(100);
        } catch (err) {
          console.log(err);
        }
        // Filter out any null values.
        setData(
          res.data.filter(
            (element) => element.people_fully_vaccinated_per_hundred !== null
          )
        );
      }
      fetchData();
    } else if (graphType === 2) {
      async function fetchData() {
        let res;
        try {
          res = await axios({
            method: "get",
            url: `${BACKEND_URL}/vaccinations/by-state`,
          });
          setXKey("location");
          setBarKey("total_vaccinations_per_hundred");
          // The max is ~2.7 so 3 should cover it.
          setYMax(3);
        } catch (err) {
          console.log(err);
        }
        // Divide total vacs per hundred by 100 to just get the # of vaccinations per person
        setData(
          res.data
            .filter(
              (element) => element.total_vaccinations_per_hundred !== null
            )
            .map((element) => {
              return {
                ...element,
                total_vaccinations_per_hundred:
                  element.total_vaccinations_per_hundred / 100,
              };
            })
        );
      }
      fetchData();
    }
  }, [graphType, watchAllValues.startDate, watchAllValues.endDate, barKey]);

  return (
    <>
      {graphType === 0 && (
        <>
          <h2>Vaccination rates over time (New York State)</h2>
          <form>
            Date ranges{" "}
            <input label={"startDate"} type="date" {...register("startDate")} />
            <input label={"endDate"} type="date" {...register("endDate")} />
          </form>
        </>
      )}
      {graphType === 1 && (
        <>
          <h2>Percentage of people who are fully vaccinated</h2>
          <p>Fully vaccinated meaning having received at least 2 doses</p>
        </>
      )}
      {graphType === 2 && (
        <>
          <h2>Average number of doses per person</h2>
          <p>
            This stat is inclusive of boosters, unlike the "fully vaccinated"
            graph above.
          </p>
        </>
      )}
      {/* Adding a random key here to force a rerender of the graph.
        The rerender triggers the animation for the graph, where it otherwise wouldn't.
      */}
      <div key={Math.random()}>
        <BarChart width={750} height={500} data={data}>
          <CartesianGrid />
          <XAxis dataKey={xKey} />
          <YAxis domain={[0, yMax]} />
          <Tooltip />
          <Legend />
          <Bar dataKey={barKey} fill="#e91e63" />
        </BarChart>
      </div>
    </>
  );
}

const covidStyles = {
  parent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  tableParent: {
    display: "flex",
    maxWidth: "75%",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  tableLeft: {
    width: "250px",
    maxWidth: "250px",
  },
  tableRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  footer: {
    maxWidth: "60%",
  },
  fauxLink: {
    cursor: "pointer",
    color: "#e91e63",
    textDecoration: "underline",
  },
  fauxLinkBold: {
    cursor: "pointer",
    color: "#e91e63",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};

export default function Covid() {
  const [graphType, setGraphType] = useState(0);

  const handleGraphTypeClick = (value) => {
    setGraphType(value);
  };

  return (
    <>
      <div style={covidStyles.parent}>
        <h1>Covid Data Visualization</h1>
        <div style={covidStyles.tableParent}>
          <section style={covidStyles.tableLeft}>
            <p>
              I wanted to put together some compact/easily readable code
              samples. Looking through some random data sets, I saw one with
              Covid vaccination numbers, and thought it'd be interesting to poke
              around.{" "}
            </p>
            <p>
              Click the links below for some graphs that answer some questions I
              had, like:
            </p>
            <p
              style={
                graphType === 0
                  ? covidStyles.fauxLinkBold
                  : covidStyles.fauxLink
              }
              onClick={() => {
                handleGraphTypeClick(0);
              }}
            >
              What did vaccinations rates over time look like?
            </p>
            <p
              style={
                graphType === 1
                  ? covidStyles.fauxLinkBold
                  : covidStyles.fauxLink
              }
              onClick={() => {
                handleGraphTypeClick(1);
              }}
            >
              What states are the most vaccinated?
            </p>
            <p
              style={
                graphType === 2
                  ? covidStyles.fauxLinkBold
                  : covidStyles.fauxLink
              }
              onClick={() => {
                handleGraphTypeClick(2);
              }}
            >
              Which states have the most doses per person administered?
            </p>
          </section>

          <section style={covidStyles.tableRight}>
            <Graph graphType={graphType} />
          </section>
        </div>
        <footer style={covidStyles.footer}>
          <p>
            I wrote the front end using React/Next.js, and made the backend
            webserver using Python Flask. Both servers are hosted on Heroku.
          </p>
          <p>
            The front end code can be found{" "}
            <a href={"https://github.com/grepfruit19/portfolio-frontend"}>
              here
            </a>
            , and the backend code can be found{" "}
            <a href={"https://github.com/grepfruit19/portfolio-backend"}>
              here
            </a>
            .
          </p>
          <p>
            Data was found{" "}
            <a
              href={
                "https://www.kaggle.com/datasets/sandhyakrishnan02/united-states-covid19-vaccinations"
              }
            >
              on Kaggle
            </a>
            , and I migrated the data to a PostgreSQL database.
          </p>
        </footer>
      </div>
    </>
  );
}
