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

const styles = {
  parent: {
    display: "flex",
    justifyContent: "center",
  },
  fauxLink: {
    cursor: "pointer",
    color: "blue",
    textDecoration: "underline",
  },
};

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
  const [graphHeader, setGraphHeader] = useState("");

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

  useEffect(() => {
    if (graphType === 0) {
      async function fetchData() {
        let res;
        try {
          res = await axios({
            method: "get",
            url: "http://127.0.0.1:5000/vaccinations/daily",
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
            url: "http://127.0.0.1:5000/vaccinations/by-state",
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
            url: "http://127.0.0.1:5000/vaccinations/by-state",
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
            <p>Date ranges</p>
            <input label={"startDate"} type="date" {...register("startDate")} />
            <input label={"endDate"} type="date" {...register("endDate")} />
            {/* <input type="submit" /> */}
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
        <BarChart width={850} height={500} data={data}>
          <CartesianGrid />
          <XAxis dataKey={xKey} />
          <YAxis domain={[0, yMax]} />
          <Tooltip />
          <Legend />
          <Bar dataKey={barKey} fill="#33b0ff" />
        </BarChart>
      </div>
    </>
  );
}

export default function Covid() {
  const [graphType, setGraphType] = useState(0);

  const handleGraphTypeClick = (value) => {
    setGraphType(value);
  };

  return (
    <>
      <div id="sidebar" style={styles.parent}>
        <div>
          <h1>Covid Data Visualization</h1>
          <p>
            I pulled some Covid vaccination data, and was curious about a few
            questions, like:
          </p>
          <p
            style={styles.fauxLink}
            onClick={() => {
              handleGraphTypeClick(0);
            }}
          >
            What did vaccinations rates over time look like?
          </p>
          <p
            style={styles.fauxLink}
            onClick={() => {
              handleGraphTypeClick(1);
            }}
          >
            What states are the most vaccinated?
          </p>
          <p
            style={styles.fauxLink}
            onClick={() => {
              handleGraphTypeClick(2);
            }}
          >
            Which states have the most doses per person administered?
          </p>

          <Graph graphType={graphType} />

          <p>
            The front end was done using React, react-hook-form and recharts.
          </p>
          <p>
            The backend is a Python Flask webserver that pulls from PostgreSQL.
          </p>
          <p>
            Data was found{" "}
            <a
              href={
                "https://www.kaggle.com/datasets/sandhyakrishnan02/united-states-covid19-vaccinations"
              }
            >
              here
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
