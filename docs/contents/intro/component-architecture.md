---
title: Components
date: 2014-17-03 18:00
template: page.jade
---

> We’re not designing pages, we’re designing systems of components. — [Stephen Hay](http://bradfrostweb.com/blog/mobile/bdconf-stephen-hay-presents-responsive-design-workflow/)

## Introduction

While not exactly a new concept, component-based development has been difficult to implement in the Web. The limitations of HTML/DOM, the differences between all the involved technologies (CSS and JavaScript), and the unique/distinct visual and functional requirements of each project, make it extremely difficult to build systems of loosely-coupled but cohesive components. It's not surprising that this is a challenge, HTML was built to create documents, not applications. However, it evolved in ways probably no-one originally predicted, and it's now common to use it to build complex, but highly maintainable systems on the web by taking a component-based approach.

## What are components in a web page

This post about [Atomic Design](http://bradfrostweb.com/blog/post/atomic-web-design/) does a very good job at describing components from a UI/style perspective. From a design stand-point, any HTML element that requires styling is a component (e.g. input fields, buttons, etc..), and in turn you can have components that include these components to create more complex components (e.g. search form would include both and input field and a button). 

The problem is, creating a component that uses markup, style and JavaScript involves:

* An html snippet
* A stylesheet
* A JavaScript file

If this seems familiar to what you'd find in a jQuery plugin, it is because that is exactly what jQuery plugins are, and that (but not only), is where [Web Components](http://www.w3.org/TR/components-intro/) and [React](http://facebook.github.io/react/index.html) shine.

Unlike the atomic design concepts, in the JavaScript developer perspective, a component is usually a UI component that has a mutable "state". This could be a simple button that gets disabled after you click it, or a list that uses web sockets to keep itself up-to-date and re-renders itself when new comments arrive.

### Web Components

Web components make full use of the existing languages of the web and enable you to write your own, custom HTML tags (components). Your components can bundle their HTML structure, style and functionality in a cohesive unit, that can be stored in a single file and included on the page for re-use like this:

```html
<link rel="import" href="MySearchComponent.html">
```

By default, and since they provide a primarily html-friendly way to structure your page, they fit best in standard markup-heavy type web pages and will likely end up replacing things like jQuery plugins.

If you wish to learn more about web components, we suggest looking into [Polymer](http://www.polymer-project.org), as it provides polyfills for older browsers and allows you to start working with Web Components today among other interesting features.



### React Components

[React](http://facebook.github.io/react/index.html) is similar to Web Components in the sense that both help building reusable component-based architectures, but React takes a different, data-focused, zero markup, JavaScript (and CSS) only, approach to building your application. This approach leads itself very well to single-page type applications that have frequently changing data and where UI responsiveness is more important than SEO (e.g. mobile or productivity apps).

One big difference between React and Web Components is that React doesn't play very well with the DOM/HTML. Once you decide that one part of your app will be a React Component (e.g. sidebar), everything within that component _should_ be managed by React. 
Important to note as well, is that React only supports the standard DOM elements out of the box, which means any custom web components you write will not be supported easily.
This "rupture" with HTML/DOM is an unfortunate, but necessary evil, and is precisely one of the strengths of React. By abstracting the DOM away from the developer, and handling the UI rendering internally, React let's you focus more of your attention on data and the components themselves.

