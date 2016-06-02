# translate-stories

This is the server and client code for an eBook / EPUB translation project

Client-side code is modified from the <a href="https://github.com/dohliam/gasp-translator">Global African Storybook Project</a> and
<a href="https://github.com/readium/readium-js">Readium-JS</a>.

<a href="http://translate-stories.herokuapp.com/epub">/epub</a> uses Readium to open an EPUB file and split it into pages. You can swipe between
pages using Owl Carousel 2.

<a href="http://translate-stories.herokuapp.com/book">/book</a> lets you view multiple stories from the
<a href="http://www.africanstorybook.org">African Storybook Project</a>. Longer pages are split up by sentence, so users can translate one
sentence at a time on their mobile device.

Server-side code is ExpressJS with PassportJS for authentication.

## License

Open source, MIT license
