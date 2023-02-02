export default function Home() {
  return (
    <>
      <div className="flex-container">
        <div className="col-left" id="intro">
          <div id="header">
            {/* <img alt="logo" id="logo" src="logo.png" /> */}
            <h1>William Kim</h1>
          </div>
          <div>
            👋 Hi! I'm a fullstack developer with over 5 years experience!
          </div>
          {/* <img alt="headshot" id="headshot" src="headshot-pink.png" /> */}
        </div>

        <div className="col-right" id="about">
          Test
          <h3>Who I Am:</h3>
          <ul>
            <li>Someone with a strong CS background.</li>
            <li>Someone with a foundation in web development.</li>
            <li>Someone versatile who can tackle many problems</li>
          </ul>
          <h3>Things I've Made:</h3>
          <ul>
            <li>
              <a href="/covid">I </a>
            </li>
          </ul>
          <ul>
            <li>
              <li>
                <a href="https://github.com/orcaprotocol/orca-sdk">
                  At my previous job I wrote the SDK that powers the entire
                  front end!
                </a>
              </li>
              <ul>
                <li>
                  I'm quite proud of that one, you can check the documentation
                  out{" "}
                  <a href="https://orcaprotocol.github.io/orca-sdk/">here</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="https://github.com/willikers19/summarizer">
                Automatic Article Summarizer
              </a>
            </li>
            <li>
              <a href="https://github.com/willikers19/vidi">Vidi Web App</a>
            </li>
            <li>
              <a href="https://github.com/willikers19/chrome-tab-counter">
                Facebook Shamer (Chrome Extension)
              </a>
            </li>
            <li>
              <a href="https://github.com/willikers19/breaking-website">
                Breaking Website
              </a>
            </li>
            <li>
              <a href="https://github.com/willikers19/HearthstoneDesignPlan">
                Hearthstone Design Plan
              </a>
            </li>
          </ul>
          <h3>Contact Me:</h3>
          <ul>
            <li>wtk219 (at) nyu (dot) edu</li>
            <li>
              <a href="https://github.com/willikers19/">Github</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/william-kim-378316105/">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
