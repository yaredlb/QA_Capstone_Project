import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

// Load JSON data once for all Virtual Users (VUs)
const loginData = new SharedArray("users", function () {
  return JSON.parse(open("./loginData.json"));
});

export let options = {
  cloud: {
    projectID: 3753111,
    name: "Performance Testing - Login Test",
  },
  scenarios: {
    // constant_arrival: {
    //   executor: "constant-arrival-rate",
    //   rate: 10, // 10 iterations per second
    //   timeUnit: "1s", // Per second
    //   duration: "40s", // Total test duration
    //   preAllocatedVUs: 10, // Pre-allocate 10 VUs
    //   maxVUs: 20, // Allow up to 20 VUs if needed
    // },
    ramping_arrival: {
      executor: "ramping-arrival-rate",
      startRate: 5, // Start with 5 iterations per second
      timeUnit: "1s",
      preAllocatedVUs: 20, // Pre-allocate more VUs
      maxVUs: 50, // Increase maxVUs to prevent limits
      stages: [
        { duration: "10s", target: 10 }, // Ramp up to 10 requests per second
        { duration: "15s", target: 20 }, // Increase to 20 requests per second
        { duration: "10s", target: 5 }, // Gradually ramp down to 5 requests per second
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<2000", "p(95)<500", "avg<200"],
    http_req_failed: ["rate<0.01"],
    http_reqs: ["rate>5"],
  },
};

export default function () {
  let user = loginData[Math.floor(Math.random() * loginData.length)];
  let url =
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate";

  let payload = JSON.stringify({
    username: user.username,
    password: user.password,
  });

  let params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    "is status 200": (r) => r.status === 200,
    "login successful": (r) =>
      r.body.includes("login") || r.body.includes("success"),
    "is not server error": (r) => r.status < 500,
    "has correct Content-Type header": (r) =>
      r.headers["Content-Type"] &&
      r.headers["Content-Type"].includes("text/html"),
  });

  sleep(1);
}
