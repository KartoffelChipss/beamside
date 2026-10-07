<p align="center">
    <img src="public/favicon.svg" alt="Beamside logo" width="96" height="96" />
</p>

<h1 align="center">Beamside</h1>

<p align="center">
    A presenter view for LaTeX Beamer slides, right in your browser.
    <br />
    <a href="https://beamside.de"><strong>beamside.de</strong></a>
</p>

## What it does

Beamer can put speaker notes next to or below each slide in the PDF it compiles. Beamside takes
that PDF and splits it up: your audience sees only the slides on the projector, while you see your
notes, the current slide and the next one on your own screen.

- Detects automatically whether your notes are on the right, at the bottom, or missing. PDFs
  without notes work too.
- Opens the slides in a separate window that you move to the projector and show in fullscreen.
- Flexible presenter view with presets and layouts for notes, the current slide and the next slide.
- Presentation timer you can start, pause and reset.
- Laser pointer, pen and eraser to point at or draw on your slides live.
- Keyboard navigation, light and dark theme, English and German.
- Installable as an app and works offline once loaded.

## Privacy

Beamside collects no data. There are no accounts, no analytics and no tracking.

Your PDF is never uploaded anywhere. It is opened and rendered entirely in your browser, and it
never leaves your computer. The only things Beamside stores are your settings, and those stay in
your browser's local storage.

## Usage

### Online

Open [beamside.de](https://beamside.de), select your PDF and start presenting. Nothing to install.

### Preparing your slides

To put your notes next to each slide, add this to the preamble of your Beamer document:

```latex
\setbeameroption{show notes on second screen=right}
```

Use `=bottom` instead to place them below the slides. Then write your notes with `\note{...}`
inside or after a frame and compile as usual.

### Presenting

1. Select your PDF, or drop it onto the start screen.
2. Click **Open slides window**, move that window to the projector and press `F` for fullscreen.
3. Keep the main window on your own screen as your presenter view.

| Action                   | Keys                                 |
| ------------------------ | ------------------------------------ |
| Next slide               | `Right`, `Down`, `Space`, `PageDown` |
| Previous slide           | `Left`, `Up`, `PageUp`               |
| First or last slide      | `Home`, `End`                        |
| Slides window fullscreen | `F`                                  |

The help button in the app explains everything in more detail.

## Self hosting

Beamside is a static website, so you can host it yourself. A Docker image for `amd64` and `arm64`
is available as [`kartoffelchipss/beamside`](https://hub.docker.com/r/kartoffelchipss/beamside).

With Docker:

```bash
docker run -d -p 8080:80 --name beamside --restart unless-stopped kartoffelchipss/beamside:latest
```

Or with Docker Compose, using the [`compose.yaml`](compose.yaml) from this repository:

```bash
docker compose up -d
```

Beamside is then available at [http://localhost:8080](http://localhost:8080). Set
`BEAMSIDE_PORT` to use a different port with Compose.

You can also build the image yourself with `docker build -t beamside .`, or run `pnpm build` and
serve the `dist` folder with any web server.

## Development

You need Node.js 22 and pnpm.

```bash
pnpm install
pnpm dev
```

Before committing, run `pnpm format` and `pnpm lint`. `pnpm build` creates a production build in
`dist`.

## License

Beamside is free software, licensed under the
[GNU General Public License v3.0](LICENSE). You can use, study, share and modify it under the
terms of that license.
