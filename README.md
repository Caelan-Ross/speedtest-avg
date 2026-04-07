# speedtest-avg

A lightweight Node.js/Express container that fetches monthly average stats from [Speedtest Tracker](https://github.com/alexjustesen/speedtest-tracker) and serves them as an iframe-embeddable widget for [Homepage](https://github.com/gethomepage/homepage).

## What it does

The built-in Homepage speedtest-tracker widget only shows the most recent result. This container hits the `/api/v1/stats` endpoint with a `start_at` filter set to the first of the current month, returning averaged download, upload, and ping values across all tests for that period.

## Requirements

- [Speedtest Tracker](https://github.com/alexjustesen/speedtest-tracker) (alexjustesen fork) v1.2.0+
- An API token with the `speedtests:read` scope
- Docker + Docker Compose

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Caelan-Ross/speedtest-avg.git
   cd speedtest-avg
   ```

2. Edit `docker-compose.yml` and set your environment variables:
   ```yaml
   environment:
     - SPEEDTEST_URL=http://your-speedtest-tracker-url:port
     - SPEEDTEST_API_KEY=your_api_key_here
   ```

3. Build and run:
   ```bash
   docker compose up -d --build
   ```

The widget is served on port `8766` by default. Visit `http://your-host:8766` to verify.

## Generating an API token

In Speedtest Tracker: **Settings → API Tokens → Create token** with the `speedtests:read` scope.

## Homepage integration

Add this to your `services.yaml`:

```yaml
- Speedtest Tracker:
    icon: speedtest-tracker.png
    href: "http://your-speedtest-tracker-url:port"
    description: "Internet speed monitoring."
    siteMonitor: "http://your-speedtest-tracker-url:port"
    widget:
      type: iframe
      src: http://your-host:8766
      classes: h-24
```

## File structure

```
speedtest-avg/
├── docker-compose.yml
└── app/
    ├── Dockerfile
    ├── package.json
    ├── server.js
    └── public/
        └── styles.css
```
