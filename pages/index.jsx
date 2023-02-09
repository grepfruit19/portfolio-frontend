import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";

const styles = {
  name: {
    color: "#e91e63",
    marginLeft: "2rem",
  },
  parent: {
    display: "flex",
    padding: "3rem",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    width: "85%",
    maxWidth: "1100px",
    padding: "3rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40rem",
    flexWrap: "wrap",
  },
  left: {
    column: {
      flex: 2,
    },
    header: {
      display: "flex",
      alignItems: "center",
    },
  },
  right: {
    column: {
      flex: 3,
      margin: "1rem",
      padding: "1rem",
      borderLeft: "1px solid",
    },
  },
  headshot: {
    width: "8rem",
    height: "8rem",
    margin: "1rem",
    borderRadius: "5rem",
  },

  accordionParent: {},
  accordion: {
    margin: "2rem",
  },
  accordionSummary: {
    backgroundColor: "#ffe7de",
    fontWeight: "bold",
    color: "#e91e63",
  },
};

export default function Home() {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const handleChange = (panel) => (event, isExpanded) => {
    setActiveAccordion(isExpanded ? panel : false);
  };

  return (
    <>
      <div style={styles.parent}>
        <Paper style={styles.paper} elevation={3}>
          <section style={styles.left.column}>
            <div style={styles.left.header}>
              <Image
                style={{ borderRadius: "100px" }}
                width={"150"}
                height={"150"}
                alt="Headshot"
                src="/headshot-pink.png"
              />
              <h1 style={styles.name}>Will Kim</h1>
            </div>
            <div>
              <h1>👋 Hi! Thanks for visiting!</h1>
              Thanks for visiting my page. If you're here to check out some code
              samples, you can go <Link href="/covid">here</Link>! I put up a
              simple little web app, and also have links to some other work I've
              done in the past.
            </div>
          </section>

          <section style={styles.right.column}>
            <div>
              As for me, I am:
              <div style={styles.accordionParent}>
                <Accordion
                  expanded={activeAccordion === 0}
                  onChange={handleChange(0)}
                  sx={styles.accordionParent}
                >
                  <AccordionSummary sx={styles.accordionSummary}>
                    A fullstack engineer with over 5 years experience
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      <li>
                        I've used TypeScript, React and Express for most of that
                        time
                      </li>
                      <li>I've also used Python with Flask/Django</li>
                      <li>
                        I have a bachelor's in computer science (and I know how
                        to use it!)
                      </li>
                    </ul>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={activeAccordion === 1}
                  onChange={handleChange(1)}
                >
                  <AccordionSummary sx={styles.accordionSummary}>
                    A very flexible developer
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      <li>
                        I've worked in consulting and startup environments my
                        whole career, which means I've had to do a LOT of
                        different things
                      </li>
                      <li>
                        I've setup CI/CD pipelines, including managing automated
                        releases/deployments
                      </li>
                      <li>
                        Written extensive backend tests that required a lot of
                        atypical mocks
                      </li>
                      <li>Setup monitoring tools like Sentry</li>
                      <li>Setup and worked with memory caches like Redis</li>
                      <li>
                        Worked with cloud computing services like Azure and AWS
                      </li>
                    </ul>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={activeAccordion === 2}
                  onChange={handleChange(2)}
                >
                  <AccordionSummary sx={styles.accordionSummary}>
                    Transitioning out of blockchain
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      <li>It just wasn't for me, but I learned a lot!</li>
                      <li>
                        Blockchains are slow, cumbersome and inefficient so I’ve
                        become very good at working around those limitations
                      </li>
                      <li>
                        I’ve also become very good at debugging, since the
                        ecosystem is so new. One time I found a out of memory
                        bug in our code because we were{" "}
                        <a href="http://www.catb.org/esr/structure-packing/">
                          packing bits in our structs inefficiently
                        </a>
                        . Glad I remembered that from my CS classes!
                      </li>
                    </ul>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={activeAccordion === 3}
                  onChange={handleChange(3)}
                >
                  <AccordionSummary sx={styles.accordionSummary}>
                    Passionate about developer education!
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      <li>
                        I’ve created training materials and ran monthly dev
                        chapter meetings at previous jobs to share knowledge
                      </li>
                      <li>
                        I created a shared documentation repo to help onboard
                        new developers and make sure everyone’s on the same page
                      </li>
                      <li>
                        I really enjoy both being mentored and mentoring others
                      </li>
                      <li>
                        Some day I'd like to teach computer science in some way
                      </li>
                    </ul>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={activeAccordion === 4}
                  onChange={handleChange(4)}
                >
                  <AccordionSummary sx={styles.accordionSummary}>
                    I also do some other stuff!
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      <li>I’ve played guitar since high school</li>
                      <li>I've also been break dancing for nearly a decade</li>
                      <li>
                        I am grappling with the fact that a decade is becoming a
                        smaller percentage of my life as I age
                      </li>
                      <li>I also started playing volleyball recently!</li>
                      <li>
                        I would be a great addition to any company volleyball
                        team, or rock band (or some combination of the two)
                      </li>
                    </ul>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
            {/* <div>If you'd like the above in a formal resume, click here.</div> */}
          </section>
        </Paper>
      </div>
    </>
  );
}
