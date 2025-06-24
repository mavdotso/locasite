Repository: adamhowell/mainland
Files analyzed: 98

Estimated tokens: 191.7k

Directory structure:
└── adamhowell-mainland/
    ├── README.md
    ├── MIT-LICENSE
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── webpack.config.js
    ├── .babelrc
    └── src/
        ├── App.jsx
        ├── index.html
        ├── index.js
        ├── components/
        │   ├── Breadcrumb/
        │   │   ├── Breadcrumb.module.scss
        │   │   └── index.jsx
        │   ├── Buttons/
        │   │   ├── Buttons.module.scss
        │   │   └── index.jsx
        │   ├── Canvas/
        │   │   ├── Actions.jsx
        │   │   ├── Card.jsx
        │   │   └── index.jsx
        │   ├── CollapseMenu/
        │   │   ├── CollapseMenu.module.scss
        │   │   └── index.jsx
        │   ├── Header/
        │   │   ├── Header.module.scss
        │   │   ├── index.jsx
        │   │   ├── MainActions/
        │   │   │   └── index.jsx
        │   │   ├── ResponsiveActions/
        │   │   │   └── index.jsx
        │   │   └── SidebarActions/
        │   │       ├── index.jsx
        │   │       └── SidebarActions.module.scss
        │   ├── Icons/
        │   │   └── index.jsx
        │   ├── Inputs/
        │   │   ├── Input/
        │   │   │   └── index.jsx
        │   │   ├── Label/
        │   │   │   └── index.jsx
        │   │   ├── Select/
        │   │   │   └── index.jsx
        │   │   └── TextArea/
        │   │       └── index.jsx
        │   ├── Layout/
        │   │   ├── index.jsx
        │   │   └── Layout.module.scss
        │   ├── Modals/
        │   │   ├── AI.jsx
        │   │   ├── Export.jsx
        │   │   ├── Import.jsx
        │   │   ├── index.jsx
        │   │   ├── Modal.jsx
        │   │   ├── Modals.module.scss
        │   │   ├── SidebarModal.jsx
        │   │   ├── ImageSource/
        │   │   │   ├── ExternalImages.jsx
        │   │   │   ├── index.jsx
        │   │   │   └── UploadImage.jsx
        │   │   └── MediaLibrary/
        │   │       ├── ExternalImages.jsx
        │   │       ├── index.jsx
        │   │       └── UploadImage.jsx
        │   ├── Sidebar/
        │   │   ├── index.jsx
        │   │   ├── Sidebar.module.scss
        │   │   ├── Blocks/
        │   │   │   ├── Blocks.module.scss
        │   │   │   ├── ButtonBlock.jsx
        │   │   │   └── index.jsx
        │   │   ├── Layers/
        │   │   │   ├── index.jsx
        │   │   │   ├── Layer.jsx
        │   │   │   └── Layers.module.scss
        │   │   ├── Settings/
        │   │   │   ├── index.jsx
        │   │   │   └── Settings.module.scss
        │   │   └── StyleManager/
        │   │       ├── index.jsx
        │   │       ├── StyleManager.module.scss
        │   │       ├── Background/
        │   │       │   └── index.jsx
        │   │       ├── Borders/
        │   │       │   └── index.jsx
        │   │       ├── BoxShadow/
        │   │       │   └── index.jsx
        │   │       ├── Classes/
        │   │       │   ├── Classes.module.scss
        │   │       │   └── index.jsx
        │   │       ├── Effects/
        │   │       │   └── index.jsx
        │   │       ├── Flex/
        │   │       │   └── index.jsx
        │   │       ├── FlexChild/
        │   │       │   └── index.jsx
        │   │       ├── Grid/
        │   │       │   └── index.jsx
        │   │       ├── Layout/
        │   │       │   └── index.jsx
        │   │       ├── Position/
        │   │       │   └── index.jsx
        │   │       ├── Size/
        │   │       │   └── index.jsx
        │   │       ├── Spacing/
        │   │       │   └── index.jsx
        │   │       └── Typography/
        │   │           └── index.jsx
        │   └── StyleManager/
        │       ├── AlignSelector/
        │       │   └── index.jsx
        │       ├── BordersSelector/
        │       │   ├── BordersSelector.module.scss
        │       │   ├── Button.jsx
        │       │   └── index.jsx
        │       ├── ClassSelector/
        │       │   └── index.jsx
        │       ├── ImageSelector/
        │       │   └── index.jsx
        │       ├── PropertySelector/
        │       │   └── index.jsx
        │       ├── RangeSelector/
        │       │   ├── index.jsx
        │       │   └── RangeSelector.module.scss
        │       ├── SpacingSelector/
        │       │   ├── index.jsx
        │       │   └── SpacingSelector.module.scss
        │       ├── SrcSelector/
        │       │   └── index.jsx
        │       └── TagSelector/
        │           └── index.jsx
        ├── configs/
        │   ├── index.js
        │   └── tailwind.js
        ├── helpers/
        │   └── index.js
        ├── redux/
        │   ├── classes-reducer.js
        │   ├── data-reducer.js
        │   ├── layout-reducer.js
        │   ├── modals-reducer.js
        │   └── store.js
        ├── render/
        │   └── template.js
        ├── styles/
        │   ├── classes.js
        │   ├── index.css
        │   ├── mediumTheme.js
        │   └── variables.scss
        └── utils/
            └── index.js


================================================
FILE: README.md
================================================
# TailwindCSS-powered WYSIWYG page builder

Mainland is an open source WYSIWYG page builder built exclusively with TailwindCSS in mind.

## What is Mainland?

Mainland is an open source WYSIWYG landing page builder powered by TailwindCSS & enhanced with AI. 

With Mainland you can visually create web pages, landing pages and more using TailwindCSS – the world’s most popular CSS framework – and easily generate images, text and even HTML with AI.

The key features of Mainland are:

- **Powered by Tailwind CSS**: The world’s most popular CSS framework, Tailwind CSS makes it easy for hundreds of thousands of developers and teams to build quickly and uniformly. Mainland’s support for Tailwind makes it easy for you and your team to integrate Mainland using the CSS framework you already know and love and run in production.
- **Open Source WYSIWYG**: Mainland is the world’s first open source, WYSIWYG page builder that fully supports Tailwind by default.
- **AI enhanced**: Securely use your Open AI API token to seemlessly add HTML templates, headers, paragraphs and images to your pages.

https://github.com/Accomplice-AI/mainland/assets/26133/f3d4fdb1-00e3-4999-8558-2271f99b4ed0

## Why Mainland?

Mainland was designed primarily for use inside Content Management Systems to speed up the creation of dynamic templates and replace common WYSIWYG editors, which are good for content editing, but inappropriate for creating HTML structures. It’s especially useful for teams that already use TailwindCSS everywhere else in their dev stack. Using Mainland user generated content can have the same class structure as everything else in your webapp and consume fewer resources.

## Usage

Directly in the browser:

```<div id="mainland-widget"></div>

<noscript> You need to enable JavaScript to run this app. </noscript>
<script src="path/to/mainlandJs.js"></script>
<script src="https://cdn.tailwindcss.com"></script>

<script>
  mainlandJs.init({
    target: "#mainland-widget",
    blocks: [
      {
        label: "Section",
        attributes: { class: "mld-section" },
        content: `<section></section>`,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><path d="M58,2c2.2,0,4,1.8,4,4v52c0,2.2-1.8,4-4,4H6c-2.2,0-4-1.8-4-4V6c0-2.2,1.8-4,4-4H58 M58,0H6C2.7,0,0,2.7,0,6v52c0,3.3,2.7,6,6,6h52c3.3,0,6-2.7,6-6V6C64,2.7,61.3,0,58,0L58,0z"/></svg>',
      },
    ],
  });
</script>
```

## License

The software is free for use under the MIT License.

## Authors & Contributors

Developed by Yaroslav Luchenko and Adam Howell.



================================================
FILE: MIT-LICENSE
================================================
Copyright 2023 Accomplice AI, Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


================================================
FILE: package.json
================================================
{
  "name": "mainland_js",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Mainland-AI/mainland_js.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/Mainland-AI/mainland_js/issues"
  },
  "homepage": "https://github.com/Mainland-AI/mainland_js#readme",
  "dependencies": {
    "@babel/cli": "^7.21.0",
    "@babel/core": "^7.21.4",
    "@babel/plugin-proposal-class-properties": "^7.18.6",
    "@babel/preset-env": "^7.21.4",
    "@babel/preset-react": "^7.18.6",
    "babel-loader": "^9.1.2",
    "bootstrap-icons": "^1.10.5",
    "hex-to-rgba": "^2.0.1",
    "html-react-parser": "^3.0.16",
    "immutability-helper": "^3.1.1",
    "openai": "^3.3.0",
    "react": "^18.2.0",
    "react-collapsed": "^4.0.2",
    "react-contenteditable": "^3.3.7",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "react-dnd-multi-backend": "^8.0.1",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.2.3",
    "react-frame-component": "^5.2.6",
    "react-medium-editor": "^1.8.1",
    "react-redux": "^8.0.5",
    "react-select": "^5.7.3",
    "redux": "^4.2.1",
    "redux-thunk": "^2.4.2",
    "shortid": "^2.2.16"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "copy-webpack-plugin": "^11.0.0",
    "css-loader": "^6.7.3",
    "file-loader": "^6.2.0",
    "node-sass": "^8.0.0",
    "postcss": "^8.4.23",
    "postcss-import": "^15.1.0",
    "postcss-loader": "^7.2.4",
    "postcss-nesting": "^11.2.2",
    "sass-loader": "^13.2.2",
    "style-loader": "^3.3.2",
    "tailwindcss": "^3.3.2",
    "url-loader": "^4.1.1",
    "webpack": "^5.86.0",
    "webpack-cli": "^5.0.2",
    "webpack-dev-server": "^4.13.3"
  }
}



================================================
FILE: postcss.config.js
================================================
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}


================================================
FILE: tailwind.config.js
================================================
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{html,jsx}", 
    "./src/styles/**/*.{html,js}"],
  theme: {
    extend: {

    },
  },
  plugins: [],
}


================================================
FILE: webpack.config.js
================================================
const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

let configDev = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/env",
            {
              plugins: ["@babel/plugin-proposal-class-properties"],
            },
          ],
        },
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ],
      },
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|ico)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./fonts/",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx"],
    fallback: {
      crypto: false,
    },
  },
  output: {
    path: path.resolve("./dist"),
    publicPath: "/",
    filename: "mainlandJs.js",
    library: "mainlandJs",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  devServer: {
    static: "./src/",
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
};

let configProd = {
  entry: "./src/index.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/env",
            {
              plugins: ["@babel/plugin-proposal-class-properties"],
            },
          ],
        },
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ],
      },
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./img/",
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./fonts/",
            },
          },
        ],
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve("./dist"),
    filename: "mainlandJs.js",
    library: "mainlandJs",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve('src/index.html'), to: path.resolve('dist/index.html') },
      ],
    }),
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    return configDev;
  }

  if (argv.mode === "production") {
    return configProd;
  }
};



================================================
FILE: .babelrc
================================================
{
  "presets": ["@babel/env", "@babel/preset-react"],
}



================================================
FILE: src/App.jsx
================================================
import React, { useEffect } from "react";
import { defaultConfig } from "./configs";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import Breadcrumb from "./components/Breadcrumb";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useDispatch } from "react-redux";
import { setConfig } from "./redux/data-reducer";
import Modals from "./components/Modals";
import { useClassNames } from "./helpers";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./styles/index.css";

const Init = ({ userConfig }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setConfig({
        ...defaultConfig,
        ...userConfig,
        blocks: [...defaultConfig.blocks, ...userConfig.blocks],
      })
    );
  }, [userConfig]);

  return <></>;
};

const App = ({ userConfig }) => {
  return (
    <Provider store={store}>
      <Init userConfig={userConfig} />
      <DndProvider backend={HTML5Backend}>
        <Layout
          slotHeader={<Header />}
          slotSidebar={<Sidebar />}
          slotBreadcrumb={<Breadcrumb />}
          slotModals={<Modals />}
        />
      </DndProvider>
    </Provider>
  );
};

export default App;



================================================
FILE: src/index.html
================================================
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Mainland</title>
  </head>

  <body>
    <div id="mainland-widget"></div>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <script src="mainlandJs.js"></script>
    <script>
      mainlandJs.init({
        target: "#mainland-widget",
        redirectURL: "/home",
        apiURL: "https://www.example-server/api",
        blocks: [
          {
            label: "Section",
            attributes: { class: "mld-section" },
            content: `<section></section>`,
            icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><path d="M58,2c2.2,0,4,1.8,4,4v52c0,2.2-1.8,4-4,4H6c-2.2,0-4-1.8-4-4V6c0-2.2,1.8-4,4-4H58 M58,0H6C2.7,0,0,2.7,0,6v52c0,3.3,2.7,6,6,6h52c3.3,0,6-2.7,6-6V6C64,2.7,61.3,0,58,0L58,0z"/></svg>',
          },
        ],
      });
    </script>
  </body>
</html>



================================================
FILE: src/index.js
================================================
import React from "react";
import App from "./App.jsx";
import { createRoot } from 'react-dom/client';

export const init = (config) => {
  const target = config ? config.target ? config.target : "#mainland-widget" : "#mainland-widget";
  const domNode = document.querySelector(target);
  const root = createRoot(domNode);
  root.render(<App userConfig={{ ...config, target: document.querySelector(target) }} />);
}


================================================
FILE: src/components/Breadcrumb/Breadcrumb.module.scss
================================================
@import "../../../src/styles/variables.scss";

.root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-left: 1rem;
}


================================================
FILE: src/components/Breadcrumb/index.jsx
================================================
import React from "react";
import { useSelectedNode } from "../../helpers";
import styles from "./Breadcrumb.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedSection,
  setHoveredSection,
} from "../../redux/data-reducer";

const Breadcrumb = () => {
  const selectedNode = useSelectedNode();
  const { dom } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const generate = () => {
    let path = [];
    let isFound = false;

    const id = selectedNode.id;

    const checkNode = (node) => {
      let subPath = [];

      if (node.children) {
        node.children.forEach((n) => {
          if (!isFound) {
            if (n.id === id) {
              subPath = [n];
              isFound = true;
            } else {
              subPath = [n, ...checkNode(n)];
            }
          }
        });
      }

      return subPath;
    };

    dom.forEach((node) => {
      if (!isFound) {
        if (node.id === id) {
          path = [node];
          isFound = true;
        } else {
          path = [node, ...checkNode(node)];
        }
      }
    });
    return path;
  };

  return (
    <div className={`${styles.root} bg-slate-800 text-slate-200`}>
      {selectedNode && (
        <>
          {generate().map((node, i) => (
            <div key={`brn-${i}`}>
              {i !== 0 && <span>&nbsp;&#62;&nbsp;</span>}
              <span
                onClick={() => dispatch(setSelectedSection(node))}
                onMouseEnter={() => dispatch(setHoveredSection(node))}
                onMouseLeave={() => dispatch(setHoveredSection(null))}
                className="p-1 rounded transition hover:bg-slate-600 cursor-pointer leading-none"
              >
                {node?.label
                  ? `${node?.label} (${node?.tagName})`
                  : node?.tagName}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Breadcrumb;



================================================
FILE: src/components/Buttons/Buttons.module.scss
================================================
@import "../../styles//variables.scss";

.root {
  background-color: transparent;
  outline: none;
  display: inline-flex;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;
  transition: all $transition ease;
}

.active {
  opacity: 1;
}

.md {
  height: $button-md;
}

.sm {
  height: $button-sm;
}

.lg {
  height: $button-lg;
}

.active {
  opacity: 1;
}


================================================
FILE: src/components/Buttons/index.jsx
================================================
import React from "react";
import styles from "./Buttons.module.scss";

export const Button = (props) => {
  const { children, size, active, className, disabled, isUnderline, ...rest } = props;

  const getSize = () => {
    switch (size) {
      case "md":
        return styles.md;
      case "sm":
        return styles.sm;
      case "lg":
        return styles.lg;
      default:
        return "";
    }
  };

  return (
    <div
      {...rest}
      className={`${styles.root} ${disabled ? "opacity-20 pointer-events-none" : "opacity-60"} hover:opacity-100 ${getSize()} ${active ? styles.active : ""} ${
        isUnderline && "border-b-2 "
      }${active && isUnderline ? "border-stone-300" : "border-transparent"} ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};



================================================
FILE: src/components/Canvas/Actions.jsx
================================================
import React, { useEffect, useState } from "react";
import { IconClose, IconChevronDown, IconChevronUp } from "../Icons";
import { useDispatch, useSelector } from "react-redux";
import {
  removeNode,
  setSelectedParent,
  setSelectedChild,
} from "../../redux/data-reducer";

const Actions = ({ node, isBottom, isInner }) => {
  const dispatch = useDispatch();
  const { id } = node;
  const { hoveredSection, selectedSection } = useSelector(
    (state) => state.data
  );
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    if (selectedSection?.id === id || hoveredSection?.id === id) {
      setTimeout(() => {
        setTransition(true);
      }, 100);
    } else {
      setTransition(false);
    }
  }, [selectedSection, hoveredSection]);

  const onUp = () => {
    dispatch(setSelectedParent(id));
  };

  const onDown = () => {
    dispatch(setSelectedChild(id));
  };
  const onRemove = () => {
    dispatch(removeNode(id));
  };

  const isActive = () =>
    selectedSection?.id === id || hoveredSection?.id === id;

  return (
    <div
      className={`absolute ${
        isBottom ? (isInner ? "left-[2px]" : "left-0") : "left-0"
      } ${
        isBottom
          ? isInner
            ? "bottom-[2px]"
            : isActive()
            ? "bottom-[-25px]"
            : "bottom-0"
          : "top-[-25px]"
      } h-5 font-normal flex bg-white items-center cursor-pointer py-1 px-1.5 text-xs transition-opacity ${
        isActive() ? "opacity-100" : "opacity-0"
      } rounded ${isActive() ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {hoveredSection?.id === id && !(selectedSection?.id === id) ? (
        <span className="text-black text-sm capitalize">{node.tagName}</span>
      ) : (
        <>
          <div
            onClick={() => {
              if (onUp) onUp();
            }}
            className="mr-2 text-black opacity-80 hover:opacity-100 transition-opacity"
          >
            <IconChevronUp />
          </div>
          <div
            className="mr-2 text-black opacity-80 hover:opacity-100 transition-opacity"
            onClick={() => {
              if (onDown) onDown();
            }}
          >
            <IconChevronDown />
          </div>
          <div
            className="text-black opacity-80 hover:opacity-100 transition-opacity"
            onClick={() => {
              if (onRemove) onRemove();
            }}
          >
            <IconClose />
          </div>
        </>
      )}
    </div>
  );
};

export default Actions;



================================================
FILE: src/components/Canvas/Card.jsx
================================================
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  setSelectedSection,
  setHoveredSection,
  updateText,
  addToNode,
  setHighlight,
} from "../../redux/data-reducer";
import { useDispatch, useSelector } from "react-redux";
import Actions from "./Actions";
import {
  htmlToJson,
  checkAndReturnStyles,
  isCanContainsChildren,
  getEditableTagName,
  replceSpecialCharacters,
  getDefaultDisplayClassEditable,
} from "../../utils";
//import ContentEditable from "react-contenteditable";
import { openModal } from "../../redux/modals-reducer";
import ContentEditable from "react-medium-editor";

export const Card = ({
  index,
  moveCard,
  children,
  node,
  isEditable,
  windowFrame,
}) => {
  const { id, backgroundImage, className } = node;
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { hoveredSection, selectedSection, dropHighlight } = useSelector(
    (state) => state.data
  );
  const [isCanEdit, setIsCanEdit] = useState(0);
  const { isPreview } = useSelector((state) => state.layout);
  const editableRef = useRef();

  useEffect(() => {
    if ((!selectedSection && editableRef?.current) || (selectedSection?.id != id && editableRef?.current)) {
      editableRef.current.medium.origElements.blur();
      if (windowFrame.getSelection) {
        if (windowFrame.getSelection().empty) {
          windowFrame.getSelection().empty();
        } else if (windowFrame.getSelection().removeAllRanges) {
          windowFrame.getSelection().removeAllRanges();
        }
      } else if (windowFrame.document.selection) {
        windowFrame.document.selection.empty();
      }
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedSection?.id != id && editableRef?.current) {
      editableRef.current.medium.origElements.blur()
    }
  }, [hoveredSection]);

  const colorBright = useMemo(
    () => (node.tagName === "body" ? "#696969" : "#adadad"),
    [node]
  );
  const colorDark = useMemo(() => "#696969", [node]);

  const style = useMemo(
    () => ({
      ...(!isPreview
        ? {
            border: `1px dashed ${colorDark}`,
          }
        : {}),
    }),
    [colorDark, isPreview]
  );

  useEffect(() => {
    if (!hoveredSection) clearHightLight();
  }, [hoveredSection]);

  const highlight = (monitor) => {
    const hoverBoundingRect = ref.current?.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const clientOffset = monitor.getClientOffset();

    if (clientOffset) {
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      const left = (hoverClientX * 100) / hoverMiddleX;
      const top = (hoverClientY * 100) / hoverMiddleY;

      const offset = 50;

      const percentages = [
        { position: "top", value: top < 100 && top < offset ? top : 0 },
        { position: "left", value: left < 100 && left < offset ? left : 0 },
        {
          position: "right",
          value: left > 100 && left - 100 > offset ? 100 - (left - 100) : 0,
        },
        {
          position: "bottom",
          value: top > 100 && top - 100 > offset ? 100 - (top - 100) : 0,
        },
      ];

      const greater = percentages.sort((a, b) => a.value - b.value).pop();

      greater.value > 0
        ? dispatch(setHighlight({ id: id, position: greater.position }))
        : !node.isClosed
        ? dispatch(setHighlight({ id: id, position: "all" }))
        : dispatch(setHighlight(null));
    }
  };

  const [{ handlerId }, drop] = useDrop(
    {
      accept: ["card", "block"],
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
          id: id,
        };
      },
      canDrop() {
        return dropHighlight;
      },
      drop(item, monitor) {
        if (
          (!item.data && !node) ||
          (!item.data && !hoveredSection) ||
          monitor.didDrop() ||
          (!item.data && item.id === id)
        )
          return;
        if (!ref.current) {
          return;
        }

        const dragId = item.id;
        const hoverId = id;

        if (!(node.isClosed && !dropHighlight)) {
          if (item.data) {
            const doc = new DOMParser().parseFromString(
              replceSpecialCharacters(item.data.content),
              "text/xml"
            );
            dispatch(
              addToNode(
                htmlToJson(doc.firstChild, item.data.attributes),
                hoverId
              )
            );
          } else {
            moveCard(dragId, hoverId, node);
          }
        }

        dispatch(setHighlight(null));
      },
      hover(item, monitor) {
        if (monitor.isOver({ shallow: true })) {
          highlight(monitor);
        }
      },
    },
    [node, dropHighlight]
  );

  const [dragTargetProps, drag] = useDrag(
    {
      type: "card",
      canDrag:
        !isPreview && hoveredSection?.id === id && node.tagName !== "body",
      item: () => {
        return { id, index };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        id: id,
      }),
    },
    [hoveredSection, id, isPreview]
  );

  const opacity = dragTargetProps.isDragging ? 0 : 1;
  drag(drop(ref));

  const onMouseMove = (e) => {
    if (e.target.id === id && hoveredSection?.id !== id)
      dispatch(setHoveredSection(node));
  };

  const onMouseLeave = () => {
    dispatch(setHoveredSection(null));
  };

  const onClick = (e) => {
    if (e.target.id === id) dispatch(setSelectedSection(node));
  };

  const clearHightLight = () => {
    dispatch(setHighlight(null));
  };

  const onDragLeave = () => {
    clearHightLight();
  };

  const borderStyles = useMemo(
    () => ({
      borderWidth: "1px",
      borderTopColor:
        dropHighlight?.id === id &&
        (dropHighlight.position === "top" || dropHighlight.position === "all")
          ? "white"
          : selectedSection?.id === id || hoveredSection?.id === id
          ? colorBright
          : colorDark,
      borderTopStyle:
        dropHighlight?.id === id &&
        (dropHighlight.position === "top" || dropHighlight.position === "all")
          ? "solid"
          : selectedSection?.id === id || hoveredSection?.id === id
          ? "solid"
          : "dashed",
      borderBottomColor:
        dropHighlight?.id === id &&
        (dropHighlight.position === "bottom" ||
          dropHighlight.position === "all")
          ? "white"
          : selectedSection?.id === id || hoveredSection?.id === id
          ? colorBright
          : colorDark,
      borderBottomStyle:
        dropHighlight?.id === id &&
        (dropHighlight.position === "bottom" ||
          dropHighlight.position === "all")
          ? "solid"
          : selectedSection?.id === id || hoveredSection?.id === id
          ? "solid"
          : "dashed",
      borderLeftColor:
        dropHighlight?.id === id &&
        (dropHighlight.position === "left" || dropHighlight.position === "all")
          ? "white"
          : selectedSection?.id === id || hoveredSection?.id === id
          ? colorBright
          : colorDark,
      borderLeftStyle:
        dropHighlight?.id === id &&
        (dropHighlight.position === "left" || dropHighlight.position === "all")
          ? "solid"
          : selectedSection?.id === id || hoveredSection?.id === id
          ? "solid"
          : "dashed",
      borderRightColor:
        dropHighlight?.id === id &&
        (dropHighlight.position === "right" || dropHighlight.position === "all")
          ? "white"
          : selectedSection?.id === id || hoveredSection?.id === id
          ? colorBright
          : colorDark,
      borderRightStyle:
        dropHighlight?.id === id &&
        (dropHighlight.position === "right" || dropHighlight.position === "all")
          ? "solid"
          : selectedSection?.id === id || hoveredSection?.id === id
          ? "solid"
          : "dashed",
    }),
    [selectedSection, hoveredSection, dropHighlight]
  );

  const isBottom = () => {
    return ref?.current?.getBoundingClientRect().top < 25;
  };

  const stylesNotEditable = {
    ...style,
    ...(node.style ? checkAndReturnStyles(node) : {}),
    cursor:
      !isPreview && hoveredSection?.id === id && node.tagName !== "body"
        ? "move"
        : "default",
    opacity,
    ...(!isPreview ? borderStyles : {}),
    ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}),
    ...(backgroundImage ? { backgroundSize: "cover" } : {}),
    ...(!children && isCanContainsChildren(node.tagName)
      ? { height: !className?.includes("h-") && !isPreview ? "30px" : "" }
      : {}),
    zIndex: selectedSection?.id === id && isBottom() ? 2 : 1,
  };

  const isInner = () => {
    if (node.tagName === "body")
      return ref?.current?.getBoundingClientRect().bottom -
        windowFrame?.innerHeight <
        25
        ? true
        : false;
  };

  const onDoubleClick = () => {
    if (node.tagName === "img") dispatch(openModal("imageSource"));
  };

  return isEditable && node.content ? (
    <div
      className={`relative p-1 ${className ? className : ""}`}
      id={id}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onDragLeave={onDragLeave}
      ref={ref}
      style={{
        ...style,
        display: getDefaultDisplayClassEditable(node.tagName),
        ...(node.style ? checkAndReturnStyles(node) : {}),
        cursor:
          !isPreview && hoveredSection?.id === id && node.tagName !== "body"
            ? "move"
            : "default",
        opacity,
        ...(!isPreview ? borderStyles : {}),
        ...(backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : {}),
        ...(backgroundImage ? { backgroundSize: "cover" } : {}),
        ...(node.tagName === "li" ? { display: "list-item" } : {}),
        zIndex: selectedSection?.id === id && isBottom() ? 2 : 1,
      }}
      data-handler-id={handlerId}
    >
      {!isPreview && (
        <Actions isBottom={isBottom()} isInner={isInner()} node={node} />
      )}
      <ContentEditable
        style={{
          textAlign: "inherit",
          pointerEvents:
            selectedSection?.id != id || isPreview ? "none" : "all",
        }}
        text={node.content}
        ref={editableRef}
        onBlur={() => setIsCanEdit(false)}
        onClick={(e) => {
          dispatch(setSelectedSection(node));
          setIsCanEdit(true);
        }}
        options={{
          toolbar: { buttons: ["bold", "italic", "underline", "anchor"] },
          contentWindow: windowFrame,
          ownerDocument: windowFrame.document,
          elementsContainer: windowFrame.document.body,
        }}
        className="w-full block"
        onChange={(text) => dispatch(updateText(id, text))}
        tag={getEditableTagName(node.tagName)}
      />
    </div>
  ) : children ? (
    <node.tagName
      className={`${node.children?.length ? "" : "empty"} ${
        className ? className : ""
      } relative`}
      id={id}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onDragLeave={onDragLeave}
      ref={ref}
      style={stylesNotEditable}
      data-handler-id={handlerId}
    >
      {!isPreview && (
        <Actions isBottom={isBottom()} isInner={isInner()} node={node} />
      )}
      {children}
    </node.tagName>
  ) : (
    <div
      className={`relative`}
      id={id}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onDragLeave={onDragLeave}
      onDoubleClick={onDoubleClick}
      ref={ref}
      style={{
        display: getDefaultDisplayClassEditable(node.tagName),
        ...stylesNotEditable,
        ...(node.width ? { width: node.width } : {}),
        ...(node.height ? { height: node.height } : {}),
      }}
      data-handler-id={handlerId}
      {...(node.width ? { width: node.width } : {})}
      {...(node.height ? { height: node.height } : {})}
    >
      {!isPreview && (
        <Actions isBottom={isBottom()} isInner={isInner()} node={node} />
      )}
      <node.tagName
        className={`${node.children?.length ? "" : "empty"} ${
          !isPreview ? "pointer-events-none" : ""
        } ${className ? className : ""}`}
        {...(node.src ? { src: node.src } : {})}
        {...(node.width ? { width: node.width } : {})}
        {...(node.height ? { height: node.height } : {})}
      >
        {children}
      </node.tagName>
    </div>
  );
};



================================================
FILE: src/components/Canvas/index.jsx
================================================
import React, { useCallback, useEffect } from "react";
import {
  moveNode,
  setSelectedSection,
  setHoveredSection,
  setBackward,
  setForward,
  removeNode,
  save
} from "../../redux/data-reducer";
import { useDispatch, useSelector } from "react-redux";
import { closeAllModals } from "../../redux/modals-reducer";
import { Card } from "./Card";

const Canvas = ({ windowFrame }) => {
  const dispatch = useDispatch();
  const { dom, selectedSection } = useSelector((state) => state.data);
  const { config } = useSelector((state) => state.data);

  useEffect(()=>{
    if(config?.apiURL) dispatch(save())
  }, [dom])

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onKeyDown = (e) => {
    const evtobj = window.event ? e : e;
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) dispatch(setBackward());
    if (evtobj.keyCode == 89 && evtobj.ctrlKey) dispatch(setForward());
    if (evtobj.keyCode == 27) {
      dispatch(closeAllModals());
      dispatch(setSelectedSection(null));
    }
    if (evtobj.keyCode == 46) dispatch(removeNode());
  };

  const moveCard = useCallback((dragId, hoverId, node) => {
    dispatch(moveNode(dragId, hoverId, node));
  }, []);

  const renderCard = useCallback(
    (node, index) => {
      return !node.isHidden && node.children?.length && !node.content ? (
        <Card
          key={`sd-s${index}`}
          index={index}
          node={node}
          moveCard={moveCard}
          windowFrame={windowFrame}
        >
          {node.children.map((n, i) => renderCard(n, i))}
        </Card>
      ) : (
        !node.isHidden && (
          <Card
            key={`sd-si${index}`}
            index={index}
            node={node}
            moveCard={moveCard}
            isEditable={true}
            windowFrame={windowFrame}
          ></Card>
        )
      );
    },
    [selectedSection]
  );

  const onCanvasEnter = () => {
    dispatch(setHoveredSection(null));
  };

  const onCanvasClick = (e) => {
    if (e.target.id === "canvas") dispatch(setSelectedSection(null));
  };

  return (
    <div
      onClick={onCanvasClick}
      onMouseEnter={onCanvasEnter}
      id="canvas"
      className={`w-full h-screen text-white`}
    >
      <div className={`mx-auto h-full`}>
        {dom?.map((item, i) => renderCard(item, i))}
      </div>
    </div>
  );
};

export default Canvas;



================================================
FILE: src/components/CollapseMenu/CollapseMenu.module.scss
================================================
@import "../../../src/styles/variables.scss";

.root {
  display: block;
}

.toggler {
  display: flex;
  align-items: center;
}

.icon {
  font-size: 0.4rem;
}


================================================
FILE: src/components/CollapseMenu/index.jsx
================================================
import React from "react";
import styles from "./CollapseMenu.module.scss";
import { useCollapse } from "react-collapsed";
import { IconTriangle } from "../Icons";

const CollapseMenu = ({ children, title }) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(
    {
      defaultExpanded: true,
    }
  );

  return (
    <div className={`${styles.root} border-b p-4 border-slate-600`}>
      <button className={`${styles.toggler}`} {...getToggleProps()}>
        <IconTriangle
          className={`${styles.icon} me-2 transition-transform ${
            isExpanded ? "rotate-0" : "rotate-180"
          }`}
        />
        <span>{title}</span>
      </button>
      <section {...getCollapseProps()}>
        <div>{children}</div>
      </section>
    </div>
  );
};

export default CollapseMenu;



================================================
FILE: src/components/Header/Header.module.scss
================================================
@import "../../../src/styles/variables.scss";

.root {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.sidebarActionsContainer {
  width: $sidebar-width;
  height: 100%;
}

.mainActions {
  width: calc(100% - #{$sidebar-width});
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 1rem;
}



================================================
FILE: src/components/Header/index.jsx
================================================
import React from "react";
import styles from "./Header.module.scss";
import SidebarActions from "./SidebarActions";
import ResponsiveActions from "./ResponsiveActions";
import MainActions from "./MainActions";
import { useSelector } from "react-redux";
import { IconArrowLeftShort } from "../Icons";
import { Button } from "../Buttons";

const Header = () => {
  const { config } = useSelector((state) => state.data);

  return (
    <div className={`${styles.root} bg-slate-800 text-white`}>
      <div className={`${styles.mainActions} h-full`}>
        {config?.redirectURL ? (
          <div className="h-full flex">
            <Button
              onClick={() => window.location.href = config?.redirectURL}
              className={`text-md bg-slate-900 h-full`}
            >
              <IconArrowLeftShort />
            </Button>
            <ResponsiveActions />
          </div>
        ) : (
          <ResponsiveActions />
        )}
        <MainActions />
      </div>
      <div className={`${styles.sidebarActionsContainer}`}>
        <SidebarActions />
      </div>
    </div>
  );
};

export default Header;



================================================
FILE: src/components/Header/MainActions/index.jsx
================================================
import React from "react";
import {
  IconDownload,
  IconCode,
  IconEye,
  IconArrowLeft,
  IconArrowRight,
} from "../../Icons";
import { Button } from "../../Buttons";
import { useDispatch, useSelector } from "react-redux";
import { setIsPreview } from "../../../redux/layout-reducer";
import { openModal } from "../../../redux/modals-reducer";
import { setBackward, setForward } from "../../../redux/data-reducer";

const MainActions = () => {
  const { isPreview } = useSelector((state) => state.layout);
  const { past, future } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center">
      <Button
        onClick={() => dispatch(setBackward())}
        disabled={past.length <= 0}
        className={`text-lg h-full`}
      >
        <IconArrowRight />
      </Button>
      <Button
        onClick={() => dispatch(setForward())}
        disabled={future.length <= 0}
        className={`text-lg h-full`}
      >
        <IconArrowLeft />
      </Button>
      <Button
        onClick={() => dispatch(openModal("export"))}
        className={`text-lg h-full`}
      >
        <IconCode />
      </Button>
      <Button
        active={isPreview}
        onClick={() => dispatch(setIsPreview(!isPreview))}
        className={`text-lg h-full`}
      >
        <IconEye />
      </Button>
      <Button onClick={() => dispatch(openModal("import"))} className={`text-lg h-full`}>
        <IconDownload />
      </Button>
    </div>
  );
};

export default MainActions;



================================================
FILE: src/components/Header/ResponsiveActions/index.jsx
================================================
import React from "react";
import { IconDisplay, IconLaptop, IconPhone, IconTablet } from "../../Icons";
import { Button } from "../../Buttons";
import { useDispatch, useSelector } from "react-redux";
import { setResponsiveView } from "../../../redux/layout-reducer";

const responsiveButtons = [
  { name: "sm", icon: <IconPhone /> },
  { name: "md", icon: <IconTablet /> },
  { name: "lg", icon: <IconLaptop /> },
  { name: "xl", icon: <IconDisplay /> },
];

const ResponsiveActions = () => {
  const { responsiveView } = useSelector((state) => state.layout);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center h-full">
      {responsiveButtons.map((button, i) => (
        <Button
          key={`rbi-${i}`}
          isUnderline
          active={responsiveView === button.name}
          onClick={() => dispatch(setResponsiveView(button.name))}
          className={`text-lg h-full`}
        >
          {button.icon}
        </Button>
      ))}
    </div>
  );
};

export default ResponsiveActions;



================================================
FILE: src/components/Header/SidebarActions/index.jsx
================================================
import React from "react";
import styles from "./SidebarActions.module.scss";
import { IconList, IconLayers, IconSettings, IconClose } from "../../Icons";
import { Button } from "../../Buttons";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../../redux/layout-reducer";

export const sidebarTabs = [
  { label: "Style manager", id: "style-manager", icon: <IconList /> },
  { label: "Layers", id: "layers", icon: <IconLayers /> },
  { label: "Settings", id: "settings", icon: <IconSettings /> },
  { label: "Blocks", id: "blocks", icon: <IconClose />, style: styles.plus },
];

const Header = () => {
  const { activeTab } = useSelector((state) => state.layout);
  const dispatch = useDispatch();

  return (
    <div className={`${styles.root}`}>
      {sidebarTabs.map((tab, i) => (
        <Button
          isUnderline
          onClick={() => dispatch(setActiveTab(tab.id))}
          key={`sa-${i}`}
          active={activeTab === tab.id}
          className={tab.style ? tab.style : ""}
        >
          {tab.icon}
        </Button>
      ))}
    </div>
  );
};

export default Header;



================================================
FILE: src/components/Header/SidebarActions/SidebarActions.module.scss
================================================
@import "../../../../src/styles/variables.scss";

.root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  font-size: 1.4rem;
}

.plus {
  font-size: 0.875rem;

  svg {
    transform: rotate(-45deg);
  }
}


================================================
FILE: src/components/Icons/index.jsx
================================================
import React from "react";

export const IconList = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"
    />
    <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z" />
    <path
      fillRule="evenodd"
      d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"
    />
  </svg>
);

export const IconLayers = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
  >
    <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z" />
  </svg>
);

export const IconSettings = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
  >
    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
  </svg>
);

export const IconClose = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 15 15"
  >
    <path
      d="M14.6,13.1c0.4,0.5,0.4,1.2,0,1.6c-0.5,0.5-1.2,0.5-1.6,0L7.5,9.1l-5.6,5.6c-0.5,0.5-1.2,0.5-1.6,0c-0.5-0.4-0.5-1.1,0-1.6l5.6-5.6L0.4,1.9c-0.5-0.5-0.5-1.2,0-1.6c0.4-0.5,1.1-0.5,1.5,0L7.5,6l5.6-5.6c0.4-0.5,1.1-0.5,1.5,0c0.5,0.4,0.5,1.1,0,1.6L9.1,7.5
	L14.6,13.1z"
    />
  </svg>
);

export const IconChevronDown = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 20.2 10.9"
  >
    <path d="M19.9,2l-9,8.6c-0.3,0.2-0.6,0.3-0.8,0.3c-0.2,0-0.5-0.1-0.8-0.3L0.4,2c-0.5-0.4-0.5-1.2,0-1.6c0.4-0.5,1.1-0.5,1.6,0l8.2,7.8l8.3-7.9c0.4-0.4,1.2-0.4,1.6,0C20.3,0.8,20.3,1.5,19.9,2z" />
  </svg>
);

export const IconChevronUp = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 20.2 10.9"
  >
    <path d="M0.4,8.9l9-8.6C9.5,0.1,9.8,0,10.1,0c0.3,0,0.6,0.1,0.8,0.3l9,8.6c0.5,0.4,0.5,1.2,0,1.6c-0.4,0.5-1.1,0.5-1.6,0l-8.2-7.9l-8.2,7.9c-0.4,0.4-1.2,0.4-1.6,0C-0.1,10.1-0.1,9.3,0.4,8.9z" />
  </svg>
);

export const IconTriangle = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 24 20"
  >
    <path d="M24,20H0L12,0L24,20z" />
  </svg>
);

export const IconTextLeft = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
    />
  </svg>
);

export const IconTextRight = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
    />
  </svg>
);

export const IconTextCenter = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
    />
  </svg>
);

export const IconTextJustify = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M2,9.5C2,9.2,2.2,9,2.5,9h11C13.8,9,14,9.2,14,9.5S13.8,10,13.5,10h-11C2.2,10,2,9.8,2,9.5z M2,3.5C2,3.2,2.2,3,2.5,3h11C13.8,3,14,3.2,14,3.5S13.8,4,13.5,4h-11C2.2,4,2,3.8,2,3.5z M2,6.5C2,6.2,2.2,6,2.5,6h11C13.8,6,14,6.2,14,6.5S13.8,7,13.5,7h-11C2.2,7,2,6.8,2,6.5z M2,12.5C2,12.2,2.2,12,2.5,12h11c0.3,0,0.5,0.2,0.5,0.5S13.8,13,13.5,13h-11C2.2,13,2,12.8,2,12.5z"
    />
  </svg>
);

export const IconPlus = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 12 12"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6,0c0.3,0,0.5,0.2,0.5,0.5v5h5C11.8,5.5,12,5.7,12,6c0,0.3-0.2,0.5-0.5,0.5h-5v5C6.5,11.8,6.3,12,6,12c-0.3,0-0.5-0.2-0.5-0.5v-5h-5C0.2,6.5,0,6.3,0,6c0-0.3,0.2-0.5,0.5-0.5h5v-5C5.5,0.2,5.7,0,6,0z"
    />
  </svg>
);

export const IconDisplay = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 12"
  >
    <path d="M13,12c0-0.6-2.4-1-3-1l0,0v-1h4.5c0.8,0,1.5-0.7,1.5-1.5v-7C16,0.7,15.3,0,14.5,0h-13C0.7,0,0,0.7,0,1.5v7C0,9.3,0.7,10,1.5,10H6v1l0,0c-0.6,0-3,0.4-3,1 M1.5,1h13C14.8,1,15,1.2,15,1.5v7C15,8.8,14.8,9,14.5,9h-13C1.2,9,1,8.8,1,8.5v-7C1,1.2,1.2,1,1.5,1z" />
  </svg>
);

export const IconLaptop = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1.2em"
    height="1.2em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 13 9"
  >
    <g
      transform="translate(6.5, 4.5) scale(1, -1) translate(-6.5, -4.5)"
      fill-rule="nonzero"
    >
      <path
        d="M1.58823783,8.93042317 C1.48675788,8.89254654 1.35330843,8.78442353 1.28393064,8.68180741 L1.16109347,8.49806546 L1.16109347,5.14101396 L1.16109347,1.78409678 L0.568530165,1.18398051 C0.0185486397,0.621740872 -0.0241657962,0.567746526 0.00793635751,0.421746887 C0.0292935755,0.329875909 0.104110165,0.2001283 0.178794101,0.129747609 L0.317549691,0 L6.5,0 L12.6824503,0 L12.8212059,0.129747609 C12.8958898,0.2001283 12.9707064,0.329741595 12.9920636,0.421746887 C13.0241658,0.567746526 12.9814514,0.621740872 12.4314698,1.18398051 L11.8389065,1.78409678 L11.8281616,5.2005152 L11.8121105,8.61156104 L11.6839672,8.75205379 C11.6092833,8.82767274 11.4650889,8.91417114 11.3636089,8.9466752 C11.0700467,9.02780104 1.82847337,9.01154901 1.58823783,8.93042317 Z M11.224986,5.08151273 L11.224986,1.78396247 L6.5,1.78396247 L1.77514665,1.78396247 L1.75909558,5.02738407 C1.75378943,6.81134654 1.75909558,8.30330973 1.77514665,8.34105205 C1.79119773,8.39504639 2.76819096,8.40592585 6.51074494,8.39504639 L11.224986,8.37879436 L11.224986,5.08151273 L11.224986,5.08151273 Z M7.91474987,0.886608662 C8.04819932,0.762233625 8.13893433,0.643365474 8.12301591,0.616368301 C8.08560762,0.551494496 4.91439238,0.551494496 4.87698409,0.616368301 C4.86093301,0.643365474 4.95166803,0.762367939 5.08525013,0.886608662 L5.32548567,1.10822725 L6.5,1.10822725 L7.67451433,1.10822725 L7.91474987,0.886608662 Z"
        id="Shape"
      ></path>
    </g>
  </svg>
);

export const IconPhone = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 10 16"
  >
    <path d="M8,1c0.6,0,1,0.4,1,1v12c0,0.6-0.4,1-1,1H2c-0.6,0-1-0.4-1-1V2c0-0.6,0.4-1,1-1H8z M2,0C0.9,0,0,0.9,0,2v12c0,1.1,0.9,2,2,2h6c1.1,0,2-0.9,2-2V2c0-1.1-0.9-2-2-2H2z" />
    <path d="M5,14c0.6,0,1-0.4,1-1s-0.4-1-1-1s-1,0.4-1,1S4.4,14,5,14z" />
  </svg>
);

export const IconTablet = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 12"
  >
    <path d="M1,2c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v8c0,0.6-0.4,1-1,1H2c-0.6,0-1-0.4-1-1V2z M0,10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V2c0-1.1-0.9-2-2-2H2C0.9,0,0,0.9,0,2V10z" />
    <path d="M14,6c0-0.6-0.4-1-1-1s-1,0.4-1,1s0.4,1,1,1S14,6.6,14,6z" />
  </svg>
);

export const IconDownload = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 13.9"
  >
    <path d="M0.5,8.9C0.8,8.9,1,9.1,1,9.4v2.5c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V9.4c0-0.3,0.2-0.5,0.5-0.5S16,9.1,16,9.4v2.5c0,1.1-0.9,2-2,2H2c-1.1,0-2-0.9-2-2V9.4C0,9.1,0.2,8.9,0.5,8.9z" />
    <path d="M7.6,10.9c0.2,0.2,0.5,0.2,0.7,0c0,0,0,0,0,0l3-3c0.2-0.2,0.2-0.5,0-0.7s-0.5-0.2-0.7,0L8.5,9.3V0.5C8.5,0.2,8.3,0,8,0C7.7,0,7.5,0.2,7.5,0.5v8.8L5.4,7.1C5.2,7,4.8,7,4.6,7.1s-0.2,0.5,0,0.7L7.6,10.9z" />
  </svg>
);

export const IconEye = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 11"
  >
    <path d="M16,5.5c0,0-3-5.5-8-5.5S0,5.5,0,5.5S3,11,8,11S16,5.5,16,5.5z M1.2,5.5c0.5-0.7,1-1.4,1.7-2C4.1,2.2,5.9,1,8,1s3.9,1.2,5.2,2.5c0.6,0.6,1.2,1.3,1.7,2c-0.1,0.1-0.1,0.2-0.2,0.3c-0.3,0.5-0.8,1.1-1.5,1.8C11.9,8.8,10.1,10,8,10c-2.1,0-3.9-1.2-5.2-2.5C2.2,6.9,1.7,6.2,1.2,5.5L1.2,5.5z" />
    <path d="M8,3C6.6,3,5.5,4.1,5.5,5.5S6.6,8,8,8s2.5-1.1,2.5-2.5S9.4,3,8,3z M4.5,5.5C4.5,3.6,6.1,2,8,2s3.5,1.6,3.5,3.5S9.9,9,8,9S4.5,7.4,4.5,5.5z" />
  </svg>
);

export const IconCode = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 13 8"
  >
    <path d="M4.4,0.9c0.2-0.2,0.2-0.5,0-0.7S3.8,0,3.6,0.1L0.1,3.6C0,3.8,0,4.2,0.1,4.4c0,0,0,0,0,0l3.5,3.5c0.2,0.2,0.5,0.2,0.7,0c0.2-0.2,0.2-0.5,0-0.7L1.2,4L4.4,0.9z M8.6,0.9c-0.2-0.2-0.2-0.5,0-0.7s0.5-0.2,0.7,0l3.5,3.5c0.2,0.2,0.2,0.5,0,0.7c0,0,0,0,0,0L9.4,7.9c-0.2,0.2-0.5,0.2-0.7,0c-0.2-0.2-0.2-0.5,0-0.7L11.8,4L8.6,0.9z" />
  </svg>
);

export const IconArrowLeft = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 14 15"
  >
    <path
      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
      d="M13.9,4.9c0.2-0.2,0.2-0.5,0-0.7c0,0,0,0,0,0l-4-4C9.7,0,9.3,0,9.1,0.1S9,0.7,9.1,0.9L12.3,4H2.5C1.1,4,0,5.1,0,6.5v8C0,14.8,0.2,15,0.5,15S1,14.8,1,14.5v-8C1,5.7,1.7,5,2.5,5h9.8L9.1,8.1C9,8.3,9,8.7,9.1,8.9s0.5,0.2,0.7,0L13.9,4.9z"
    />
  </svg>
);

export const IconArrowRight = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 14 15"
  >
    <path
      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
      d="M0.1,4.9C0,4.7,0,4.3,0.1,4.1c0,0,0,0,0,0l4-4C4.3,0,4.7,0,4.9,0.1s0.2,0.5,0,0.7L1.7,4h9.8C12.9,4,14,5.1,14,6.5v8c0,0.3-0.2,0.5-0.5,0.5S13,14.8,13,14.5v-8C13,5.7,12.3,5,11.5,5H1.7l3.1,3.1c0.2,0.2,0.2,0.5,0,0.7s-0.5,0.2-0.7,0C4.1,8.9,0.1,4.9,0.1,4.9z"
    />
  </svg>
);

export const IconEyeSlash = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 12.7"
  >
    <path d="M13.4,9.6C15.1,8.1,16,6.4,16,6.4s-3-5.5-8-5.5c-1,0-1.9,0.2-2.8,0.6L6,2.2C6.6,2,7.3,1.9,8,1.9c2.1,0,3.9,1.2,5.2,2.5c0.6,0.6,1.2,1.3,1.7,2c-0.1,0.1-0.1,0.2-0.2,0.3c-0.3,0.5-0.8,1.1-1.5,1.8c-0.2,0.2-0.3,0.3-0.5,0.5L13.4,9.6z" />
    <path d="M11.3,7.5c0.7-1.8-0.3-3.8-2.1-4.5c-0.8-0.3-1.6-0.3-2.4,0l0.8,0.8C9,3.7,10.3,4.6,10.5,6c0,0.2,0,0.5,0,0.7C10.5,6.7,11.3,7.5,11.3,7.5z M8.4,8.8l0.8,0.8c-1.8,0.7-3.8-0.3-4.5-2.1c-0.3-0.8-0.3-1.6,0-2.4L5.5,6C5.3,7.4,6.3,8.6,7.6,8.8C7.9,8.9,8.1,8.9,8.4,8.8z" />
    <path d="M3.3,3.8C3.2,4,3,4.1,2.8,4.3c-0.6,0.6-1.2,1.3-1.7,2l0.2,0.3c0.3,0.5,0.8,1.1,1.5,1.8c1.3,1.3,3,2.5,5.2,2.5c0.7,0,1.4-0.1,2-0.4l0.8,0.8C9.9,11.7,9,11.9,8,11.9c-5,0-8-5.5-8-5.5s0.9-1.7,2.6-3.2L3.3,3.8L3.3,3.8z M13.6,12.7l-12-12L2.4,0l12,12L13.6,12.7z" />
  </svg>
);

export const IconMove = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 16 16"
  >
    <path
      style={{ fillRule: "evenodd" }}
      d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"
    />
  </svg>
);

export const IconArrowLeftShort = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 8 7"
  >
    <path
      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
      d="M8,3.5C8,3.8,7.8,4,7.5,4H1.7l2.1,2.1c0.2,0.2,0.2,0.5,0,0.7s-0.5,0.2-0.7,0l-3-3C0,3.7,0,3.3,0.1,3.1c0,0,0,0,0,0l3-3C3.3,0,3.7,0,3.9,0.1s0.2,0.5,0,0.7L1.7,3h5.8C7.8,3,8,3.2,8,3.5z"
    />
  </svg>
);



================================================
FILE: src/components/Inputs/Input/index.jsx
================================================
import React from "react";
import { useDispatch } from "react-redux";
import { setEnableRemove } from "../../../redux/data-reducer";

const Input = ({ className, onFocus, onBlur, ...rest }) => {
  const dispatch = useDispatch();

  const onFocusInner = (e) => {
    if(onFocus) onFocus(e)
    dispatch(setEnableRemove(false))
  };

  const onBlurInner = () => {
    if(onBlur) onBlur(e)
    dispatch(setEnableRemove(true))
  };

  return (
    <input
      {...rest}
      onFocus={onFocusInner}
      onBlur={onBlurInner}
      className={`px-4 py-2 placeholder:text-slate-400 bg-slate-600 rounded w-full text-slate-300 outline-0 ${
        className ? className : ""
      } `}
    />
  );
};

export default Input;



================================================
FILE: src/components/Inputs/Label/index.jsx
================================================
import React from "react";

const Label = ({ className, children, ...rest }) => {
  return (
    <span
      {...rest}
      className={`uppercase text-slate-400 text-sm font-medium w-2/5 shrink-0 ${
        className ? className : ""
      }`}
    >
      {children}
    </span>
  );
};

export default Label;



================================================
FILE: src/components/Inputs/Select/index.jsx
================================================
import React, { useMemo } from "react";
import Select, { components } from "react-select";
import { IconTriangle } from "../../Icons";
import Label from "../Label";

const colors = require("tailwindcss/colors");

const SelectComp = (props) => {
  const { label, isDefault, isColor, isSimpleColor, ...rest } = props;

  const customStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        background: colors.slate[600],
        borderRadius: state.isFocused ? "8px 8px 0 0" : 8,
        borderColor: "transparent",
        boxShadow: state.isFocused ? null : null,
        color: colors.slate[200],
        "&:hover": {
          borderColor: state.isFocused ? colors.slate[400] : colors.slate[500],
        },
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 0,
        marginTop: 0,
      }),
      input: (base) => ({
        ...base,
        color: colors.slate[200],
        paddingLeft: "0.5rem",
      }),
      singleValue: (base, { data }) => ({
        ...base,
        color: isDefault ? colors.slate[400] : colors.slate[200],
        paddingLeft: isColor && data.value !== "none" ? 0 : "0.5rem",
        paddingRight: "0.5rem",
        fontSize: "0.875rem"
      }),
      placeholder: (base) => ({
        ...base,
        color: colors.slate[400],
        paddingLeft: "0.5rem",
      }),
      multiValue: (base) => ({
        ...base,
        color: isDefault ? colors.slate[400] : colors.slate[200],
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        fontSize: "0.875rem"
      }),
      menuList: (base) => ({
        ...base,
        padding: 0,
        background: colors.slate[600],
        fontSize: "0.875rem",
        overflowX: "hidden"
      }),
      option: (base, { isFocused, isSelected, data }) => ({
        ...base,
        background: isFocused
          ? colors.slate[500]
          : isSelected
          ? colors.slate[500]
          : undefined,
        color: colors.slate[200],
        zIndex: 1,
        padding: isSimpleColor ? "8px 9px" : "8px 12px",
        width: isSimpleColor ? "26px" : "100%"
      }),
      indicatorsContainer: (base) => ({
        ...base,
        marginRight: "0.5rem",
      }),
    }),
    [isDefault, isSimpleColor, isColor]
  );

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <IconTriangle style={{ fontSize: "0.5rem" }} className="rotate-180" />
      </components.DropdownIndicator>
    );
  };

  const SingleValue = (props) => {
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center">
          {isColor && props.data.value !== "none" && (
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                marginRight: "0.5rem",
                flexShrink: "0",
                backgroundColor: props.data.color,
              }}
            ></div>
          )}
          <span>{props.data.label}</span>
        </div>
      </components.SingleValue>
    );
  };

  const Option = (props) => {
    return (
      <components.Option {...props}>
        <div className={`flex items-center ${isSimpleColor ? "justify-center w-4" : "justify-start"}`}>
          {isColor && props.data.value !== "none" && (
            <div
              style={{
                width: isSimpleColor ? "13px" : "16px",
                height: isSimpleColor ? "13px" : "16px",
                borderRadius: "4px",
                marginRight: "0.5rem",
                flexShrink: "0",
                backgroundColor: props.data.color,
              }}
            ></div>
          )}
          {!isSimpleColor && <span>{props.data.label}</span>}
        </div>
      </components.Option>
    );
  };

  const MenuList = (props) => {
    return (
      <components.MenuList {...props} className={`${isSimpleColor ? "flex flex-wrap" : ""}`}>
          {props.children}
      </components.MenuList>
    );
  };

  return (
    <div className="flex items-center w-full">
      {label ? (
        <Label>{label}</Label>
      ) : (
        <></>
      )}
      <Select
        components={{
          DropdownIndicator,
          IndicatorSeparator: () => null,
          SingleValue,
          Option,
          MenuList
        }}
        {...rest}
        className={`${props.className ? props.className : ''} ${label ? "w-3/5" : ""} shrink-0`}
        styles={customStyles}
      />
    </div>
  );
};

export default SelectComp;



================================================
FILE: src/components/Inputs/TextArea/index.jsx
================================================
import React from "react";
import { useDispatch } from "react-redux";
import { setEnableRemove } from "../../../redux/data-reducer";

const TextArea = ({ className, rows, onFocus, onBlur, border, ...rest }) => {
  const dispatch = useDispatch();

  const onFocusInner = (e) => {
    if (onFocus) onFocus(e);
    dispatch(setEnableRemove(false));
  };

  const onBlurInner = () => {
    if (onBlur) onBlur(e);
    dispatch(setEnableRemove(true));
  };

  return (
    <textarea
      {...rest}
      onFocus={onFocusInner}
      onBlur={onBlurInner}
      className={`p-4 bg-slate-600 rounded-lg w-full text-slate-300 outline-0 ${
        className ? className : ""
      } ${border ? 'border border-slate-500' : ""}`}
      rows={rows ? rows : "3"}
    />
  );
};

export default TextArea;



================================================
FILE: src/components/Layout/index.jsx
================================================
import React, { useEffect, useContext, useState, useRef } from "react";
import styles from "./Layout.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { IconEyeSlash } from "../Icons";
import { setIsPreview } from "../../redux/layout-reducer";
import {
  removeNode,
  setBackward,
  setForward,
  setSelectedSection,
} from "../../redux/data-reducer";
import Frame, {
  FrameContextConsumer,
  FrameContext,
} from "react-frame-component";
import { DndContext } from "react-dnd";
import { screens } from "../../configs/tailwind";
import Canvas from "../Canvas";
import mediumStyles from "../../styles/mediumTheme.js";

const Layout = ({ slotHeader, slotSidebar, slotBreadcrumb, slotModals }) => {
  const { isPreview, responsiveView } = useSelector((state) => state.layout);
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const iframeRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 500);
  }, []);

  const DndFrame = ({ children }) => {
    const { dragDropManager } = useContext(DndContext);
    const { window } = useContext(FrameContext);

    useEffect(() => {
      dragDropManager.getBackend().addEventListeners(window);
    });

    return children;
  };

  const FrameBindingContext = () => (
    <FrameContextConsumer>
      {({ document, window }) => (
        <CanvasInner document={document} window={window}>
          <DndFrame>
            <Canvas windowFrame={window} documentFrame={document} />
          </DndFrame>
        </CanvasInner>
      )}
    </FrameContextConsumer>
  );

  const CanvasInner = ({ children, document, window }) => {
    const onKeyDown = (e) => {
      const evtobj = window.event ? e : e;
      if (evtobj.keyCode == 90 && evtobj.ctrlKey) dispatch(setBackward());
      if (evtobj.keyCode == 89 && evtobj.ctrlKey) dispatch(setForward());
      if (evtobj.keyCode == 46) dispatch(removeNode());
      if (evtobj.keyCode == 27) dispatch(setSelectedSection(null));
    };

    useEffect(() => {
      const tw = document.createElement("script");
      const twS = document.createElement("link");
      const twM = document.createElement("style");
      const twElm = document.querySelector("#tailwind");

      if (!twElm) {
        tw.setAttribute("src", "https://cdn.tailwindcss.com");
        tw.setAttribute("id", "tailwind");

        twS.setAttribute("rel", "stylesheet");
        twS.setAttribute("type", "text/css");
        twS.setAttribute(
          "href",
          "//cdn.jsdelivr.net/npm/medium-editor@latest/dist/css/medium-editor.min.css"
        );

        twM.innerHTML = mediumStyles;

        document.head.appendChild(twM);
        document.head.appendChild(twS);
        document.head.appendChild(tw);
      }

      window.addEventListener("keydown", onKeyDown);

      return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return children;
  };

  return (
    <div className={`${styles.root} bg-slate-950`}>
      <div
        onClick={() => dispatch(setIsPreview(false))}
        className={`${styles.previewToggler} ${isPreview ? "show" : ""}`}
      >
        <IconEyeSlash />
      </div>
      <div className={`${styles.header} ${isPreview ? "hide" : ""}`}>
        {slotHeader}
      </div>
      <div className={`${styles.inner} ${isPreview ? "expand" : ""}`}>
        <div
          className={`${styles.canvasContainer} bg-slate-950 ${
            isPreview ? "expand" : ""
          }`}
        >
          <div
            style={{
              maxWidth:
                responsiveView !== Object.keys(screens).pop()
                  ? screens[responsiveView]
                  : "100%",
            }}
            className={`${styles.canvas} bg-slate-900 transition-all ${
              isReady ? "opacity-100" : "opacity-0"
            } mx-auto ${isPreview ? "expand" : ""}`}
          >
            <Frame ref={iframeRef} style={{ width: "100%", height: "100%" }}>
              <FrameBindingContext />
            </Frame>
          </div>
          <div className={`${styles.breadcrumb} ${isPreview ? "hide" : ""}`}>
            {slotBreadcrumb}
          </div>
        </div>
        <div className={`${styles.sidebar} ${isPreview ? "hide" : ""}`}>
          {slotSidebar}
        </div>
      </div>
      {slotModals}
    </div>
  );
};

export default Layout;



================================================
FILE: src/components/Layout/Layout.module.scss
================================================
@import "../../../src/styles/variables.scss";

.root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  ::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar {
    width: 6px;
    background-color: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.header {
  height: $header-height;
  transition: transform $transition ease;

  &:global(.hide) {
    transform: translateY(-100%);
  }
}

.inner {
  height: 100%;
  max-height: calc(100% - #{$header-height});
  display: flex;
  align-items: stretch;
  transition: all $transition ease;

  &:global(.expand) {
    padding-top: 0;
    max-height: 100%;
    margin-top: -$header-height;
  }
}

.sidebar {
  position: absolute;
  top: $header-height;
  right: 0;
  width: $sidebar-width;
  height: calc(100vh - #{$header-height});
  transition: transform $transition ease;

  &:global(.hide) {
    transform: translateX($sidebar-width);
  }
}

.canvas {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-bottom: $breadcrumb-height;
  transition: all $transition ease;

  &:global(.expand) {
    padding-bottom: 0;
  }
}

.canvasContainer {
  width: 100%;
  padding-right: $sidebar-width;
  transition: padding $transition ease;

  &:global(.expand) {
    padding-right: 0;
  }
}

.breadcrumb {
  height: $breadcrumb-height;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: transform $transition ease;

  &:global(.hide) {
    transform: translateY(100%);
  }
}

.previewToggler {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.25rem;
  cursor: pointer;
  color: rgba($white, 0.8);
  transform: translateY(-3rem);
  transition: all $transition ease;

  &:global(.show) {
    transform: translateY(0);
  }

  &:hover {
    color: rgba($white, 0.5);
  }
}


================================================
FILE: src/components/Modals/AI.jsx
================================================
import React, { useState } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/modals-reducer";
import Input from "../Inputs/Input";
import Label from "../Inputs/Label";
import styles from "./Modals.module.scss";
import { useEffect } from "react";
import { buttonSimple } from "../../styles/classes";
import { tab } from "../../styles/classes";
import { Configuration, OpenAIApi } from "openai";
import { addToDom } from "../../redux/data-reducer";
import Frame, { FrameContextConsumer } from "react-frame-component";

const tabs = [{ name: "Preview" }, { name: "Code" }];

const MediaLibrary = () => {
  const { isAI, data } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState(500);

  useEffect(() => {
    if (data.prompt) setPrompt(data.prompt);
  }, [data]);

  useEffect(() => {
    if (error)
      setTimeout(() => {
        setError("");
      }, 5000);
  }, [error]);

  useEffect(() => {
    const AIKey = localStorage.getItem("AIKey");

    if (AIKey) {
      setKey(AIKey);
      setKeyInput(AIKey);
    }
  }, []);

  const onApplyKey = () => {
    setKey(keyInput);
    localStorage.setItem("AIKey", keyInput);
  };

  const onGenerate = () => {
    setIsLoading(true);

    const configuration = new Configuration({
      apiKey: key,
    });

    const openai = new OpenAIApi(configuration);

    if (data.isImage) {
      openai
        .createImage({
          prompt: prompt,
          response_format: "b64_json",
          n: 1,
          size: "512x512",
        })
        .then((d) => {
          setIsLoading(false);
          setOutput(`<img src="data:image/png;base64,${d.data.data[0].b64_json}"/>`);
        })
        .catch((err) => {
          setError(err.message);
          console.log(err);
        });
    } else {
      openai
        .createChatCompletion({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `output TailwindCSS markup that ${prompt}. Only respond with code as plain text without code block syntax around it.`,
            },
          ],
          max_tokens: tokens ? tokens : 300,
        })
        .then((d) => {
          setIsLoading(false);
          setOutput(d.data.choices[0].message.content);
        })
        .catch((err) => {
          setError(err.message);
          console.log(err);
        });
    }
  };

  const onAdd = () => {
    dispatch(closeModal("AI"));
    dispatch(addToDom({ label: "AI block", content: output }));
  };

  const FrameBindingContext = () => (
    <FrameContextConsumer>
      {({ document, window }) => (
        <Preview document={document} window={window} />
      )}
    </FrameContextConsumer>
  );

  const Preview = ({ document }) => {
    useEffect(() => {
      const tw = document.createElement("script");
      const twElm = document.querySelector("#tailwind");
      const twS = document.createElement("style");

      if (!twElm) {
        tw.setAttribute("src", "https://cdn.tailwindcss.com");
        tw.setAttribute("id", "tailwind");
        document.head.appendChild(tw);

        twS.innerHTML =
          "::-webkit-scrollbar-track {background-color: rgba(255, 255, 255, 0.1);} ::-webkit-scrollbar {width: 6px;background-color: rgba(255, 255, 255, 0.1);} ::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2);}";
        document.head.appendChild(twS);
      }
    }, []);

    return (
      <div className="border border-slate-500 w-full p-3 h-96">
        {error ? (
          <div className="w-full h-full flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          output && (
            <div
              className="h-full overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: output }}
            ></div>
          )
        )}
      </div>
    );
  };

  const renderTab = () => {
    switch (active) {
      case 0:
        return (
          <div className="h-96 mt-3">
            <Frame style={{ width: "100%", height: "100%" }}>
              <FrameBindingContext />
            </Frame>
          </div>
        );
      case 1:
        return (
          <div className="border border-slate-500 w-full h-96 mt-3 p-3">
            {error ? (
              <div className="w-full h-full flex items-center justify-center text-red-500">
                {error}
              </div>
            ) : (
              output && (
                <textarea
                  onChange={(e) => setOutput(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none"
                >
                  {output}
                </textarea>
              )
            )}
          </div>
        );
    }
  };

  return (
    <Modal onClose={() => dispatch(closeModal("AI"))} active={isAI}>
      <div className={`${styles.AI}`}>
        <div className="mt-6">
          <>
            <h4>OpenAI API Key</h4>
            <div className="flex items-center">
              <Input
                value={`${keyInput.slice(0, 10)}${keyInput
                  .slice(10, keyInput.length)
                  .split("")
                  .map((c) => "●")
                  .join("")}`}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="..."
                className={`mt-3 mb-3 bg-slate-700`}
              />
              <button
                onClick={() => onApplyKey()}
                className={`${buttonSimple}`}
              >
                Apply
              </button>
            </div>
            <div className={`${!key ? "opacity-30" : "opacity-100"}`}>
              <h4>Write prompt</h4>
              <div className="flex items-center">
                <Input
                  disabled={!key}
                  value={prompt}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && prompt) onGenerate();
                  }}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Create a blue button"
                  className={`mt-3 mb-3 bg-slate-700`}
                />
                <button
                  disabled={isLoading || !prompt}
                  onClick={() => onGenerate()}
                  className={`${buttonSimple} whitespace-nowrap pointer-events-${
                    isLoading || !prompt ? "none" : "auto"
                  } ${isLoading || !prompt ? "opacity-30" : "opacity-100"}`}
                >
                  {isLoading ? "Please wait" : "Generate"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {tabs.map((t, i) => (
                    <button
                      onClick={() => setActive(i)}
                      key={`tbi-${i}`}
                      className={`${tab} ${
                        active === i ? "text-slate-200" : "text-slate-400"
                      } ${
                        active === i ? "border-slate-200" : "border-transparent"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
                {!data.isImage && (
                  <div className="flex items-center">
                    <Label className="w-auto">Tokens</Label>
                    <Input
                      value={tokens}
                      onChange={(e) => setTokens(e.target.value)}
                      placeholder="Tokens"
                      type="number"
                      className={`mt-3 mb-3 bg-slate-700 ml-3 w-28`}
                    />
                  </div>
                )}
              </div>
              {renderTab()}
              <div className="text-center mt-4">
                <button
                  disabled={!output}
                  onClick={() => onAdd()}
                  className={`${buttonSimple} ${
                    !output ? "pointer-events-none" : "pointer-events-auto"
                  } ${!output ? "opacity-30" : "opacity-100"}`}
                >
                  Add to the Canvas
                </button>
              </div>
            </div>
          </>
        </div>
      </div>
    </Modal>
  );
};

export default MediaLibrary;



================================================
FILE: src/components/Modals/Export.jsx
================================================
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/modals-reducer";
import { htmlTemplate } from "../../render/template";
import ReactDOMServer from "react-dom/server";
import TextArea from "../Inputs/TextArea";
import { checkAndReturnStyles } from "../../utils";

const Export = () => {
  const { dom } = useSelector((state) => state.data);
  const { isExport } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const [html, setHtml] = useState("");

  const getNodes = () => {
    let reactNodes = [];

    const checkEndReturnNode = (node) => {
      if (node.children?.length) {
        return (
          <node.tagName
            {...(node.style ? { style: checkAndReturnStyles(node) } : {})}
            {...(node.className ? { className: node.className } : {})}
            {...(node.href ? { href: node.href } : {})}
            {...(node.src ? { href: node.src } : {})}
            key={node.id}
          >
            {node.children.map((n) => checkEndReturnNode(n))}
          </node.tagName>
        );
      } else {
        return (
          <node.tagName
            {...(node.style ? { style: checkAndReturnStyles(node) } : {})}
            {...(node.className ? { className: node.className } : {})}
            {...(node.href ? { href: node.href } : {})}
            {...(node.src ? { href: node.src } : {})}
            key={node.id}
          >
            {node.content && node.content}
          </node.tagName>
        );
      }
    };

    dom.forEach((node) => {
      reactNodes.push(checkEndReturnNode(node));
    });

    return reactNodes;
  };

  useEffect(() => {
    const body = ReactDOMServer.renderToStaticMarkup(getNodes());

    let result = htmlTemplate
      .replace(`{Body}`, body)
      .replace("{Title}", "Mainland app");
    setHtml(result);
  }, [dom]);

  return (
    <Modal onClose={() => dispatch(closeModal("export"))} active={isExport}>
      <TextArea defaultValue={html} rows={16} />
    </Modal>
  );
};

export default Export;



================================================
FILE: src/components/Modals/Import.jsx
================================================
import React, { useState } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/modals-reducer";
import TextArea from "../Inputs/TextArea";
import { buttonSimple } from "../../styles/classes";
import { addToDom, replaceDom } from "../../redux/data-reducer";
import { clearHTML } from "../../utils";

const Export = () => {
  const { isImport } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const [html, setHtml] = useState("");

  const onAdd = () => {
    dispatch(addToDom({ label: "Import", content: clearHTML(html) }));
    dispatch(closeModal("import"));
  };

  const onReplace = () => {
    dispatch(replaceDom({ label: "Import", content: clearHTML(html) }));
    dispatch(closeModal("import"));
  };

  return (
    <Modal onClose={() => dispatch(closeModal("import"))} active={isImport}>
      <h4 className="mb-3">Import HTML</h4>
      <TextArea
        onChange={(e) => setHtml(e.target.value)}
        defaultValue={html}
        border
        rows={16}
      />
      <div className="text-center mt-4">
        <button
          disabled={!html}
          onClick={() => onAdd()}
          className={`${buttonSimple} ${
            !html ? "pointer-events-none" : "pointer-events-auto"
          } ${!html ? "opacity-30" : "opacity-100"}`}
        >
          Add to the Canvas
        </button>
        <button
          disabled={!html}
          onClick={() => onReplace()}
          className={`${buttonSimple} ${
            !html ? "pointer-events-none" : "pointer-events-auto"
          } ${!html ? "opacity-30" : "opacity-100"}`}
        >
          Replace
        </button>
      </div>
    </Modal>
  );
};

export default Export;



================================================
FILE: src/components/Modals/index.jsx
================================================
import React from "react";
import { useSelector } from "react-redux";
import MediaLibrary from "./MediaLibrary";
import Export from "./Export";
import AI from "./AI";
import Import from "./Import";
import ImageSource from "./ImageSource";

const Modals = () => {
  const { isMediaLibrary, isImageSource, isExport, isAI, isImport } = useSelector((state) => state.modals);

  return (
    <>
      {isImageSource && <ImageSource />}
      {isMediaLibrary && <MediaLibrary />}
      {isExport && <Export />}
      {isAI && <AI />}
      {isImport && <Import />}
    </>
  );
};

export default Modals;



================================================
FILE: src/components/Modals/Modal.jsx
================================================
import React, { useState, useEffect, useRef } from "react";
import styles from "./Modals.module.scss";

const Modal = ({ children, active, onClose }) => {
  const [innerActive, setInnerActive] = useState(false);
  const modalContent = useRef();

  useEffect(() => {
    active
      ? setTimeout(() => {
          setInnerActive(active);
        }, 50)
      : setInnerActive(active);
  }, [active]);

  return (
    <div
      className={`${innerActive ? "pointer-events-auto" : "pointer-events-none"
      } overflow-auto ${
        innerActive ? "opacity-100" : "opacity-0"
      } transition duration-300 w-screen fixed top-0 left-0	h-screen z-50 flex ${
        modalContent?.current?.offsetHeight &&
        modalContent?.current?.offsetHeight > window.innerHeight
          ? "items-start"
          : "items-center"
      } justify-center`}
    >
      <div
        onClick={onClose}
        style={{
          height:
            modalContent?.current?.offsetHeight &&
            modalContent?.current?.offsetHeight > window.innerHeight
              ? `${modalContent?.current?.offsetHeight}px`
              : "100vh",
        }}
        className={`w-full absolute top-0 left-0 h-full bg-slate-900 opacity-60 shrink-0`}
      ></div>
      <div
        ref={modalContent}
        className={`${styles.modal} bg-slate-600 rounded-lg p-4 text-slate-300`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;



================================================
FILE: src/components/Modals/Modals.module.scss
================================================
@import "../../../src/styles/variables.scss";

.close {
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  position: absolute;
  top: -1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  font-size: 0.5rem;
  cursor: pointer;
}

.modal {
  position: relative;
  z-index: 1;
  width: $modal-width;
}

.mediaLibrary {
  min-height: 590px;
}


.AI {
  min-height: 650px;
}


================================================
FILE: src/components/Modals/SidebarModal.jsx
================================================
import React from "react";
import { IconClose } from "../Icons";
import styles from "./Modals.module.scss";

const SidebarModal = ({ active, children, onClose }) => {
  return (
    <div
      className={`w-full h-full absolute top-0 left-0 z-10 ${
        active ? "opacity-1" : "opacity-0"
      } ${
        active ? "pointer-events-auto" : "pointer-events-none"
      } transition bg-slate-700 rounded-lg px-4 py-2`}
    >
      <div onClick={onClose} className={`${styles.close} bg-slate-600 transition text-white hover:bg-slate-700`}>
        <IconClose />
      </div>
      {children}
    </div>
  );
};

export default SidebarModal;



================================================
FILE: src/components/Modals/ImageSource/ExternalImages.jsx
================================================
import React, { useState } from "react";
import { useSelectedNode } from "../../../helpers";
import { setAttribute } from "../../../redux/data-reducer";
import Input from "../../Inputs/Input";
import { useDispatch } from "react-redux";

const ExternalImages = () => {
  const selectedNode = useSelectedNode();
  const dispatch = useDispatch();

  return (
    <>
      <h4>{selectedNode?.src ? "Replace image" : "Add image"}</h4>
      <Input
        disabled={!selectedNode}
        defaultValue={
          selectedNode?.src ? selectedNode?.src : ""
        }
        onChange={(e) =>
          dispatch(setAttribute("src", e.target.value))
        }
        placeholder="https://example.com/images/img.png"
        className={`mt-3 mb-3 bg-slate-700`}
      />
      <h5>Preview</h5>
      <div className="border border-slate-500 w-full h-96 mt-3">
        {selectedNode?.src && (
          <img
            className="w-full h-full object-cover"
            src={selectedNode?.src}
          />
        )}
      </div>
    </>
  );
};

export default ExternalImages;



================================================
FILE: src/components/Modals/ImageSource/index.jsx
================================================
import React, { useState } from "react";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/modals-reducer";
import { tab } from "../../../styles/classes";
import styles from "../Modals.module.scss";

import UploadImage from "./UploadImage";
import ExternalImages from "./ExternalImages";

const tabs = [
  { name: "Upload image" },
  { name: "Paste URL" },
];

const ImageSource = () => {
  const { isImageSource } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);

  const renderTab = () => {
    switch (active) {
      case 0:
        return <UploadImage />;
      case 1:
        return <ExternalImages />;
    }
  };

  return (
    <Modal
      onClose={() => dispatch(closeModal("imageSource"))}
      active={isImageSource}
    >
      <div className={`${styles.mediaLibrary}`}>
        <div className="flex items-center">
          {tabs.map((t, i) => (
            <button
              onClick={() => setActive(i)}
              key={`tbi-${i}`}
              className={`${tab} ${
                active === i ? "text-slate-200" : "text-slate-400"
              } ${active === i ? "border-slate-200" : "border-transparent"}`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="mt-6">{renderTab()}</div>
      </div>
    </Modal>
  );
};

export default ImageSource;



================================================
FILE: src/components/Modals/ImageSource/UploadImage.jsx
================================================
import React, { useState, useCallback } from "react";
import { setAttribute, addImage } from "../../../redux/data-reducer";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/modals-reducer";
import { useDropzone } from "react-dropzone";
import { toBase64 } from "../../../utils";

const UploadImage = () => {
  const { mediaLibrary } = useSelector((state) => state.data);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file)=>{
      toBase64(file).then((data)=>{
        dispatch(addImage(data));
      })
    })
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg": [],
    },
    onDrop,
  });

  const dispatch = useDispatch();

  return (
    <>
      <h4>Add image</h4>
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "border-slate-200" : "border-slate-500"
        } transition p-5 flex items-center justify-center border h-40 rounded my-5 w-full`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop images here ...</p>
        ) : (
          <p>Drag 'n' drop images here, or click to select files</p>
        )}
      </div>
      <h5>Images</h5>
      <div className="w-full h-96 mt-3 flex gap-3 flex-wrap">
        {mediaLibrary?.map((image, i) => (
          <img
            onClick={() => {
              dispatch(closeModal("imageSource"));
              dispatch(setAttribute("src", image));
            }}
            key={`mdi-${i}`}
            className="w-44 h-36 object-cover cursor-pointer border border-slate-500 my-3 transition hover:border-slate-200"
            src={image}
          />
        ))}
      </div>
    </>
  );
};

export default UploadImage;



================================================
FILE: src/components/Modals/MediaLibrary/ExternalImages.jsx
================================================
import React, { useState } from "react";
import { useSelectedNode } from "../../../helpers";
import { setAttribute } from "../../../redux/data-reducer";
import Input from "../../Inputs/Input";
import { useDispatch } from "react-redux";

const ExternalImages = () => {
  const selectedNode = useSelectedNode();
  const dispatch = useDispatch();

  return (
    <>
      <h4>{selectedNode?.backgroundImage ? "Replace image" : "Add image"}</h4>
      <Input
        disabled={!selectedNode}
        defaultValue={
          selectedNode?.backgroundImage ? selectedNode?.backgroundImage : ""
        }
        onChange={(e) =>
          dispatch(setAttribute("backgroundImage", e.target.value))
        }
        placeholder="https://example.com/images/img.png"
        className={`mt-3 mb-3 bg-slate-700`}
      />
      <h5>Preview</h5>
      <div className="border border-slate-500 w-full h-96 mt-3">
        {selectedNode?.backgroundImage && (
          <img
            className="w-full h-full object-cover"
            src={selectedNode?.backgroundImage}
          />
        )}
      </div>
    </>
  );
};

export default ExternalImages;



================================================
FILE: src/components/Modals/MediaLibrary/index.jsx
================================================
import React, { useState } from "react";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/modals-reducer";
import { tab } from "../../../styles/classes";
import styles from "../Modals.module.scss";


import UploadImage from "./UploadImage";
import ExternalImages from "./ExternalImages";

const tabs = [
  { name: "External Images" },
  { name: "Generated Images" },
  { name: "Upload an image" },
  { name: "Browse Unsplash" },
];

const MediaLibrary = () => {
  const { isMediaLibrary } = useSelector((state) => state.modals);
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);

  const renderTab = () => {
    switch (active) {
      case 0:
        return <ExternalImages />;
      case 2:
        return <UploadImage />;
    }
  };

  return (
    <Modal
      onClose={() => dispatch(closeModal("mediaLibrary"))}
      active={isMediaLibrary}
    >
      <div className={`${styles.mediaLibrary}`}>
        <div className="flex items-center">
          {tabs.map((t, i) => (
            <button
              onClick={() => setActive(i)}
              key={`tbi-${i}`}
              className={`${tab} ${
                active === i ? "text-slate-200" : "text-slate-400"
              } ${active === i ? "border-slate-200" : "border-transparent"}`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="mt-6">{renderTab()}</div>
      </div>
    </Modal>
  );
};

export default MediaLibrary;



================================================
FILE: src/components/Modals/MediaLibrary/UploadImage.jsx
================================================
import React, { useState, useCallback } from "react";
import { setAttribute, addImage } from "../../../redux/data-reducer";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/modals-reducer";
import { useDropzone } from "react-dropzone";
import { toBase64 } from "../../../utils";

const UploadImage = () => {
  const { mediaLibrary } = useSelector((state) => state.data);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file)=>{
      toBase64(file).then((data)=>{
        dispatch(addImage(data));
      })
    })
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg": [],
    },
    onDrop,
  });

  const dispatch = useDispatch();

  return (
    <>
      <h4>Add image</h4>
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "border-slate-200" : "border-slate-500"
        } transition p-5 flex items-center justify-center border h-40 rounded my-5 w-full`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop images here ...</p>
        ) : (
          <p>Drag 'n' drop images here, or click to select files</p>
        )}
      </div>
      <h5>Images</h5>
      <div className="w-full h-96 mt-3 flex gap-3 flex-wrap">
        {mediaLibrary?.map((image, i) => (
          <img
            onClick={() => {
              dispatch(closeModal("mediaLibrary"));
              dispatch(setAttribute("backgroundImage", image));
            }}
            key={`mdi-${i}`}
            className="w-44 h-36 object-cover cursor-pointer border border-slate-500 my-3 transition hover:border-slate-200"
            src={image}
          />
        ))}
      </div>
    </>
  );
};

export default UploadImage;



================================================
FILE: src/components/Sidebar/index.jsx
================================================
import React from "react";
import styles from "./Sidebar.module.scss";
import { useSelector } from "react-redux";
import Blocks from "./Blocks";
import Layers from "./Layers";
import Settings from "./Settings";
import StyleManager from "./StyleManager";

const Sidebar = () => {
  const { activeTab } = useSelector((state) => state.layout);

  const renderTab = () => {
    switch (activeTab) {
      case "style-manager":
        return <StyleManager />;
      case "blocks":
        return <Blocks />;
      case "layers":
        return <Layers />;
      case "settings":
        return <Settings />;
    }
  };

  return (
    <div className={`${styles.root} bg-slate-800 text-white`}>{renderTab()}</div>
  );
};

export default Sidebar;



================================================
FILE: src/components/Sidebar/Sidebar.module.scss
================================================
.root {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}



================================================
FILE: src/components/Sidebar/Blocks/Blocks.module.scss
================================================
@import "../../../styles//variables.scss";

.root {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: $gutter;
  grid-row-gap: $gutter;
  padding: $gutter;

  > * {
    width: 100%;
  }
}

.buttonBlock {
  height: $button-block-height;
  background-color: rgba($white, 0.1);
  padding: 1rem;
  border-radius: 6px;
  border: transparent;
  outline: none;
  display: inline-flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  opacity: 0.6;
  transition: all $transition ease;

  svg {
    fill: $white;
    width: auto;
    height: $button-block-height * 0.5;
    margin-bottom: 0.5rem;
  }

  &:hover {
    background-color: rgba($white, 0.2);
  }
}

.active {
  opacity: 1;
}


================================================
FILE: src/components/Sidebar/Blocks/ButtonBlock.jsx
================================================
import React from "react";
import styles from "./Blocks.module.scss";
import { useDrag } from 'react-dnd'

const ButtonBlock = (props) => {
  const { children, size, active, className, data, ...rest } = props;

  const [{ opacity }, drag] = useDrag(
    () => ({
      type:"block",
      item: () => {
        return { data };
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.2 : 0.6,
      }),
    })
  )

  return (
    <div
      {...rest}
      ref={drag}
      style={{ opacity }}
      className={`${styles.buttonBlock} text-white ${
        active ? styles.active : ""
      } ${className ? className : ""}`}
    >
      {children}
    </div>
  );
};

export default ButtonBlock;



================================================
FILE: src/components/Sidebar/Blocks/index.jsx
================================================
import React from "react";
import styles from "./Blocks.module.scss";
import { useSelector, useDispatch } from "react-redux";
import ButtonBlock from "./ButtonBlock";
import { addToDom } from "../../../redux/data-reducer";
import { openModal } from "../../../redux/modals-reducer";

const AIBlocks = [
  {
    label: "AI Template",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><g><path d="M21.4,36.6l-3.1,9.3h-4l10.1-29.7h4.6l10.1,29.7h-4.1l-3.2-9.3H21.4z M31.1,33.6l-2.9-8.5c-0.7-1.9-1.1-3.7-1.5-5.4h-0.1c-0.4,1.8-0.9,3.6-1.5,5.4l-2.9,8.6H31.1z"/><path d="M47.4,16.3v29.7h-3.8V16.3H47.4z"/></g></svg>',
  },
  {
    label: "AI Headline",
    prompt:
      "one sentence headline about Tailwind, white typography, large, tag h1 and bold",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><g><path d="M21.4,36.6l-3.1,9.3h-4l10.1-29.7h4.6l10.1,29.7h-4.1l-3.2-9.3H21.4z M31.1,33.6l-2.9-8.5c-0.7-1.9-1.1-3.7-1.5-5.4h-0.1c-0.4,1.8-0.9,3.6-1.5,5.4l-2.9,8.6H31.1z"/><path d="M47.4,16.3v29.7h-3.8V16.3H47.4z"/></g></svg>',
  },
  {
    label: "AI Paragraph",
    prompt: "one random paragraph about Tailwind, 20-30 words, color white",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><g><path d="M21.4,36.6l-3.1,9.3h-4l10.1-29.7h4.6l10.1,29.7h-4.1l-3.2-9.3H21.4z M31.1,33.6l-2.9-8.5c-0.7-1.9-1.1-3.7-1.5-5.4h-0.1c-0.4,1.8-0.9,3.6-1.5,5.4l-2.9,8.6H31.1z"/><path d="M47.4,16.3v29.7h-3.8V16.3H47.4z"/></g></svg>',
  },
  {
    label: "AI Image",
    prompt: "abstract dark background",
    isImage: true,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><g><path d="M21.4,36.6l-3.1,9.3h-4l10.1-29.7h4.6l10.1,29.7h-4.1l-3.2-9.3H21.4z M31.1,33.6l-2.9-8.5c-0.7-1.9-1.1-3.7-1.5-5.4h-0.1c-0.4,1.8-0.9,3.6-1.5,5.4l-2.9,8.6H31.1z"/><path d="M47.4,16.3v29.7h-3.8V16.3H47.4z"/></g></svg>',
  },
];

const StyleManager = () => {
  const {
    config: { blocks },
  } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const onAddSection = (block) => {
    dispatch(addToDom(block));
  };

  return (
    <div className={`${styles.root}`}>
      {AIBlocks.map((block, i) => (
        <ButtonBlock
          onClick={() =>
            dispatch(
              openModal("AI", { prompt: block.prompt, isImage: block.isImage })
            )
          }
        >
          <div dangerouslySetInnerHTML={{ __html: block.icon }}></div>
          {block.label}
        </ButtonBlock>
      ))}
      {blocks.map((block, i) => (
        <ButtonBlock
          data={block}
          onClick={() => onAddSection(block)}
          key={`bi-${i}`}
        >
          <div dangerouslySetInnerHTML={{ __html: block.icon }}></div>
          {block.label}
        </ButtonBlock>
      ))}
    </div>
  );
};

export default StyleManager;



================================================
FILE: src/components/Sidebar/Layers/index.jsx
================================================
import React from "react";
import styles from "./Layers.module.scss";
import { useSelector } from "react-redux";
import Layer from "./Layer";

const Layers = () => {
  const { dom } = useSelector((state) => state.data);

  const renderNode = (node, i) => {
    if (node.children) {
      return (
        <Layer data={node} key={`lbi-${i}`}>
          {node.children.map((n, z) => renderNode(n, `${i}-${z}`))}
        </Layer>
      );
    } else {
      return <Layer data={node} key={`lbi-${i}`} />;
    }
  };

  return (
    <div className={`${styles.root}`}>
      {dom.map((node, i) => renderNode(node, i))}
    </div>
  );
};

export default Layers;



================================================
FILE: src/components/Sidebar/Layers/Layer.jsx
================================================
import React, { useMemo, useRef, useCallback } from "react";
import styles from "./Layers.module.scss";
import { useDrag, useDrop } from "react-dnd";
import { IconEye, IconTriangle, IconMove, IconEyeSlash } from "../../Icons";
import { useCollapse } from "react-collapsed";
import { useDispatch, useSelector } from "react-redux";
import {
  setHighlightLayer,
  moveNode,
  setHoveredLayer,
  setSelectedSection,
  setIsHiden,
} from "../../../redux/data-reducer";

const Layer = (props) => {
  const { children, data, active, className, ...rest } = props;
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true,
  });
  const dispatch = useDispatch();
  const { dropHighlightLayer, hoveredLayer, selectedSection } = useSelector(
    (state) => state.data
  );
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ["layer"],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        id: data.id,
      };
    },
    canDrop() {
      return !(data.isClosed && !dropHighlightLayer);
    },
    drop(item, monitor) {
      if (
        (!item.data && !data) ||
        (!item.data && !hoveredLayer) ||
        monitor.didDrop() ||
        (!item.data && item.id === data.id)
      )
        return;
      if (!ref.current) {
        return;
      }

      const dragId = item.id;
      const hoverId = data.id;

      if (!(data.isClosed && !dropHighlightLayer)) {
        if (item.data) {
          const doc = new DOMParser().parseFromString(
            item.data.content,
            "text/xml"
          );
          dispatch(
            addToNode(htmlToJson(doc.firstChild, item.data.attributes), hoverId)
          );
        } else {
          moveCard(dragId, hoverId, data);
        }
      }

      dispatch(setHighlightLayer(null));
    },
    hover(item, monitor) {
      if (monitor.isOver({ shallow: true })) {
        highlight(monitor);
      }
    },
  });

  const [dragTargetProps, drag] = useDrag(
    {
      type: "layer",
      canDrag: hoveredLayer?.id === data.id && data.tagName !== "body",
      item: () => {
        return { id: data.id };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        id: data.id,
      }),
    },
    [hoveredLayer, data.id]
  );

  const opacity = dragTargetProps.isDragging ? 0.2 : data.isHidden ? 0.3 : 0.6;

  drag(drop(ref));

  const highlight = (monitor) => {
    const hoverBoundingRect = ref.current?.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const clientOffset = monitor.getClientOffset();

    if (clientOffset) {
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      const left = (hoverClientX * 100) / hoverMiddleX;
      const top = (hoverClientY * 100) / hoverMiddleY;

      const offset = 50;

      const percentages = [
        { position: "top", value: top < 100 && top < offset ? top : 0 },
        { position: "left", value: left < 100 && left < offset ? left : 0 },
        {
          position: "right",
          value: left > 100 && left - 100 > offset ? 100 - (left - 100) : 0,
        },
        {
          position: "bottom",
          value: top > 100 && top - 100 > offset ? 100 - (top - 100) : 0,
        },
      ];

      const greater = percentages.sort((a, b) => a.value - b.value).pop();

      greater.value > 0
        ? dispatch(
            setHighlightLayer({ id: data.id, position: greater.position })
          )
        : !data.isClosed
        ? dispatch(setHighlightLayer({ id: data.id, position: "all" }))
        : dispatch(setHighlightLayer(null));
    }
  };

  const moveCard = useCallback((dragId, hoverId, node) => {
    dispatch(moveNode(dragId, hoverId, "layer"));
  }, []);

  const colorDark = useMemo(() => "#696969", [data]);
  const colorBright = useMemo(
    () => (data.tagName === "body" ? "#696969" : "#adadad"),
    [data]
  );

  const borderStyles = useMemo(
    () => ({
      borderWidth: "1px",
      borderTopColor:
        dropHighlightLayer?.id === data.id &&
        (dropHighlightLayer.position === "top" ||
          dropHighlightLayer.position === "all")
          ? "white"
          : selectedSection?.id === data.id || hoveredLayer?.id === data.id
          ? colorBright
          : colorDark,
      borderBottomColor:
        dropHighlightLayer?.id === data.id &&
        (dropHighlightLayer.position === "bottom" ||
          dropHighlightLayer.position === "all")
          ? "white"
          : selectedSection?.id === data.id || hoveredLayer?.id === data.id
          ? colorBright
          : colorDark,
    }),
    [hoveredLayer, dropHighlightLayer]
  );

  const clearHightLight = () => {
    dispatch(setHighlightLayer(null));
  };

  const onDragLeave = () => {
    clearHightLight();
  };

  const onMouseEnter = (e) => {
    if (e.target.id === data.id) dispatch(setHoveredLayer(data));
  };

  const onMouseLeave = () => {
    dispatch(setHoveredLayer(null));
  };

  const onClick = (e) => {
    if (e.target.id === data.id) dispatch(setSelectedSection(data));
  };

  return (
    <>
      <div
        {...rest}
        ref={ref}
        id={data.id}
        data-handler-id={handlerId}
        style={{ opacity, ...borderStyles, cursor: "pointer" }}
        onClick={onClick}
        onDragLeave={onDragLeave}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`flex text-sm items-center justify-between border-b border-slate-600 bg-slate-700 p-2 border-solid text-white select-none ${
          active ? styles.active : ""
        } ${className ? className : ""}`}
      >
        <div className="flex items-center">
          <div
            onClick={() => dispatch(setIsHiden(data.id, !data.isHidden))}
            className="mr-3"
          >
            {data.isHidden ? <IconEyeSlash /> : <IconEye />}
          </div>
          {data.children?.length > 0 && (
            <IconTriangle
              {...getToggleProps()}
              className={`${styles.icon} me-2 transition-transform ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
            />
          )}
          <span {...(data.children?.length ? getToggleProps() : {})}>
            {data.label ? `${data.label} (${data.tagName})` : data.tagName}
          </span>
        </div>
        <div className="flex items-center">
          {data.children?.length > 0 && (
            <span className="text-xs mr-2">{data.children?.length}</span>
          )}
          <IconMove />
        </div>
      </div>
      {children && (
        <div
          className={`${data.isHidden ? "opacity-50" : "opacity-100"} pl-2`}
          {...getCollapseProps()}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Layer;



================================================
FILE: src/components/Sidebar/Layers/Layers.module.scss
================================================
.root {
  width: 100%;
  height: 100%;
}

.icon {
  font-size: 0.5rem;
  outline: none;
}


================================================
FILE: src/components/Sidebar/Settings/index.jsx
================================================
import React from "react";
import styles from "./Settings.module.scss";
import CollapseMenu from "../../CollapseMenu";
import PropertySelector from "../../StyleManager/PropertySelector";
import TagSelector from "../../StyleManager/TagSelector";
import { isTagVariants } from "../../../utils";
import { useSelectedNode } from "../../../helpers";
import SrcSelector from "../../StyleManager/SrcSelector";

const StyleManager = () => {
  const selectedNode = useSelectedNode();

  return (
    <div className={`${styles.root}`}>
      <CollapseMenu title={`Details`}>
        <PropertySelector property="id" />
      </CollapseMenu>
      <CollapseMenu title={`Advanced`}>
        <PropertySelector isTextArea property="style" label="Custom CSS" />
      </CollapseMenu>
      {selectedNode?.tagName === "a" && (
        <CollapseMenu title={`Link`}>
          <PropertySelector property="href" />
        </CollapseMenu>
      )}
      {selectedNode?.tagName === "img" && (
        <CollapseMenu title={`Image source`}>
          <PropertySelector label="url / base64" property="src" />
          <SrcSelector property="src"/>
        </CollapseMenu>
      )}
      {selectedNode?.tagName === "iframe" && (
        <CollapseMenu title={`Iframe settings`}>
          <PropertySelector property="src" />
          <PropertySelector property="width" />
          <PropertySelector property="height" />
        </CollapseMenu>
      )}
      {isTagVariants(selectedNode?.tagName) && (
        <CollapseMenu title={`Tag`}>
          <TagSelector />
        </CollapseMenu>
      )}
    </div>
  );
};

export default StyleManager;



================================================
FILE: src/components/Sidebar/Settings/Settings.module.scss
================================================
.root {
  width: 100%;
}


================================================
FILE: src/components/Sidebar/StyleManager/index.jsx
================================================
import React from "react";
import { useSelectedLayout, useParentLayout } from "../../../helpers";
import styles from "./StyleManager.module.scss";
import CollapseMenu from "../../CollapseMenu";
import Classes from "./Classes";
import Layout from "./Layout";
import Spacing from "./Spacing";
import Size from "./Size";
import Position from "./Position";
import Typography from "./Typography";
import Background from "./Background";
import Effects from "./Effects";
import BoxShadow from "./BoxShadow";
import Borders from "./Borders";
import Flex from "./Flex";
import FlexChild from "./FlexChild";
import Grid from "./Grid";

const StyleManager = () => {
  const selectedLayout = useSelectedLayout();
  const parentNodeLayout = useParentLayout();

  return (
    <div className={`${styles.root}`}>
      <CollapseMenu title={`Classes`}>
        <Classes />
      </CollapseMenu>
      <CollapseMenu title={`Layout`}>
        <Layout />
      </CollapseMenu>
      {selectedLayout === "grid" && (
        <CollapseMenu title={`Grid`}>
          <Grid />
        </CollapseMenu>
      )}
      {parentNodeLayout === "flex" && (
        <CollapseMenu title={`Flex`}>
          <FlexChild />
        </CollapseMenu>
      )}
      {selectedLayout === "flex" && (
        <CollapseMenu title={`Flex`}>
          <Flex />
        </CollapseMenu>
      )}
      <CollapseMenu title={`Spacing`}>
        <Spacing />
      </CollapseMenu>
      <CollapseMenu title={`Size`}>
        <Size />
      </CollapseMenu>
      <CollapseMenu title={`Position`}>
        <Position />
      </CollapseMenu>
      <CollapseMenu title={`Typography`}>
        <Typography />
      </CollapseMenu>
      <CollapseMenu title={`Background`}>
        <Background />
      </CollapseMenu>
      <CollapseMenu title={`Borders`}>
        <Borders />
      </CollapseMenu>
      <CollapseMenu title={`Effects`}>
        <Effects />
      </CollapseMenu>
      <CollapseMenu title={`Box Shadow`}>
        <BoxShadow />
      </CollapseMenu>
    </div>
  );
};

export default StyleManager;



================================================
FILE: src/components/Sidebar/StyleManager/StyleManager.module.scss
================================================
.root {
  width: 100%;
}


================================================
FILE: src/components/Sidebar/StyleManager/Background/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";
import ImageSelector from "../../../StyleManager/ImageSelector";

const Background = () => {
  return (
    <div className={`pt-2`}>
      <ImageSelector />
      <ClassSelector name="backgroundColor" title="Color" defaultValue="none" isColor />
    </div>
  );
};

export default Background;



================================================
FILE: src/components/Sidebar/StyleManager/Borders/index.jsx
================================================
import React from "react";
import BordersSelector from "../../../StyleManager/BordersSelector";

const Borders = () => {
  return (
    <div className={`pt-2`}>
      <BordersSelector name="borders"/>
    </div>
  );
};

export default Borders;



================================================
FILE: src/components/Sidebar/StyleManager/BoxShadow/index.jsx
================================================
import React, { useState, useEffect } from "react";
import Select from "../../../Inputs/Select";
import { useSelectedNode, useShadowProps } from "../../../../helpers";
import {
  combinedColors,
  opacityValues,
  shadowLengthValues,
  shadowBlurValues,
} from "../../../../configs/tailwind";
import hexToRgba from "hex-to-rgba";
import { useDispatch, useSelector } from "react-redux";
import { setAttribute } from "../../../../redux/data-reducer";
import {
  clearShadowClassNames,
  rgba2hex,
  getColorNameByValue,
  getResponsivePrefix,
} from "../../../../utils";

const values = shadowLengthValues.map((c) => ({ value: c, label: c }));
const valuesOpacity = opacityValues.map((c) => ({ value: c, label: c }));
const valuesBlur = shadowBlurValues.map((c) => ({ value: c, label: c }));

let colors = [];

Object.keys(combinedColors).map((c) => {
  if (typeof combinedColors[c] === "string") {
    colors.push({
      value: combinedColors[c],
      label: c,
      color: combinedColors[c],
    });
  } else {
    colors.push({
      value: combinedColors[c][500],
      label: `${c}-${500}`,
      color: combinedColors[c][500],
    });
  }
});

const BoxShadow = () => {
  const selectedNode = useSelectedNode();
  const [isDefault, setIsDefault] = useState(false);
  const [lengthH, setLengthH] = useState(null);
  const [lengthV, setLengthV] = useState(null);
  const [blur, setBlur] = useState(null);
  const [spread, setSpread] = useState(null);
  const [opacity, setOpacity] = useState(null);
  const [color, setColor] = useState(null);
  const dispatch = useDispatch();
  const {
    shadowHorizontalLength,
    shadowVerticalLength,
    shadowBlur,
    shadowSpread,
    shadowColor,
  } = useShadowProps();
  const { responsiveView } = useSelector((state) => state.layout);

  useEffect(() => {
    if (shadowHorizontalLength) {
      const color = rgba2hex(shadowColor);
      setLengthH({
        value: shadowHorizontalLength,
        label: shadowHorizontalLength,
      });
      setLengthV({ value: shadowVerticalLength, label: shadowVerticalLength });
      setBlur({ value: shadowBlur, label: shadowBlur });
      setSpread({ value: shadowSpread, label: shadowSpread });
      setOpacity({ value: color.opacity, label: color.opacity });
      setColor({
        value: color.color,
        label: getColorNameByValue(combinedColors, color.color),
        color: color.color,
      });
    } else {
      setIsDefault(true);
      setLengthH(null);
      setLengthV(null);
      setBlur(null);
      setSpread(null);
      setOpacity(null);
      setColor(null);
    }
  }, [
    selectedNode,
    shadowHorizontalLength,
    shadowVerticalLength,
    shadowBlur,
    shadowSpread,
    shadowColor,
    responsiveView,
  ]);

  useEffect(() => {
      const c = shadowColor ? rgba2hex(shadowColor) : {};

      if (
        color &&
        opacity &&
        spread &&
        blur &&
        lengthV &&
        lengthH &&
        spread.value != shadowSpread &&
        blur.value != shadowBlur &&
        lengthV.value != shadowVerticalLength &&
        lengthH.value != shadowHorizontalLength &&
        color.value != c.color &&
        opacity.value != c.opacity
      ) {
        const className = `${getResponsivePrefix(responsiveView)}shadow-[${
          lengthH.value
        }_${lengthV.value}_${blur.value}_${spread.value}_${hexToRgba(
          color.value,
          opacity.value
        ).replaceAll(" ", ``)}]`;

        if (
          !selectedNode?.className?.includes(
            `${getResponsivePrefix(responsiveView)}${className}`
          )
        ) {
          const clearClassNames = clearShadowClassNames(
            selectedNode?.className,
            getResponsivePrefix(responsiveView)
          );

          dispatch(
            setAttribute(
              "className",
              `${
                selectedNode?.className
                  ? `${
                      clearClassNames
                        ? `${clearClassNames} ${className}`
                        : `${className}`
                    }`
                  : className
              }`
            )
          );
        }
      }
  }, [color, opacity, spread, blur, lengthV, lengthH]);

  return (
    <div className={`pt-2`}>
      <div className="pb-2">
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? lengthH : null}
          onChange={setLengthH}
          options={values}
          placeholder={"Select"}
          label={`Length H`}
        />
      </div>
      <div className="pb-2">
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? lengthV : null}
          onChange={setLengthV}
          options={values}
          placeholder={"Select"}
          label={`Length V`}
        />
      </div>
      <div className="pb-2">
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? blur : null}
          onChange={setBlur}
          options={valuesBlur}
          placeholder={"Select"}
          label={`Blur`}
        />
      </div>
      <div className="pb-2">
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? spread : null}
          onChange={setSpread}
          options={values}
          placeholder={"Select"}
          label={`Spread`}
        />
      </div>
      <div className="pb-2">
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? opacity : null}
          onChange={setOpacity}
          options={valuesOpacity}
          placeholder={"Select"}
          label={`Opacity`}
        />
      </div>
      <div className="pb-2">
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? color : null}
          onChange={setColor}
          options={colors}
          isColor
          placeholder={"Select"}
          label={`Color`}
        />
      </div>
    </div>
  );
};

export default BoxShadow;



================================================
FILE: src/components/Sidebar/StyleManager/Classes/Classes.module.scss
================================================
.root {
  width: 100%;
}


================================================
FILE: src/components/Sidebar/StyleManager/Classes/index.jsx
================================================
import React from "react";
import styles from "./Classes.module.scss";
import { useDispatch } from "react-redux";
import TextArea from "../../../Inputs/TextArea";
import { setAttribute } from "../../../../redux/data-reducer";
import { useSelectedNode } from "../../../../helpers";

const Classes = () => {
  const selectedNode = useSelectedNode()
  const dispatch = useDispatch();

  return (
    <div className={`${styles.root} pt-2`}>
      <TextArea
        disabled={!selectedNode}
        onChange={(e) =>
          dispatch(
            setAttribute("className", e.target.value)
          )
        }
        value={selectedNode?.className ? selectedNode.className : ""}
      />
    </div>
  );
};

export default Classes;



================================================
FILE: src/components/Sidebar/StyleManager/Effects/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";

const Effects = () => {
  return (
    <div className={`pt-2`}>
      <ClassSelector name="opacity" title="Opacity" defaultValue="none" />
      <ClassSelector name="backgroundBlendMode" title="Blending" defaultValue="none" />
      <ClassSelector name="cursor" title="Cursor" defaultValue="default" />
      <ClassSelector name="blur" title="Blur" defaultValue="none" />
    </div>
  );
};

export default Effects;



================================================
FILE: src/components/Sidebar/StyleManager/Flex/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";
import RangeSelector from "../../../StyleManager/RangeSelector";

const Flex = () => {
  return (
    <div className={`pt-2`}>
      <ClassSelector name="flexDirection" title="Direction" defaultValue="none" />
      <ClassSelector name="alignItems" title="Align" defaultValue="none" />
      <ClassSelector name="justifyContent" title="Justify" defaultValue="none" />
      <ClassSelector name="flexBasis" title="Basis" defaultValue="none" />
      <ClassSelector name="flexGrowShrink" title="Size" defaultValue="none" />
      <RangeSelector name="gap" title="Gap" defaultValue="none" />
      <RangeSelector name="gapX" title="Gap X" defaultValue="none" />
      <RangeSelector name="gapY" title="Gap Y" defaultValue="none" />
    </div>
  );
};

export default Flex;



================================================
FILE: src/components/Sidebar/StyleManager/FlexChild/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";

const FlexChild = () => {
  return (
    <div className={`pt-2`}>
      <ClassSelector name="flexGrowShrink" title="Size" defaultValue="none" />
    </div>
  );
};

export default FlexChild;



================================================
FILE: src/components/Sidebar/StyleManager/Grid/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";
import RangeSelector from "../../../StyleManager/RangeSelector";

const Flex = () => {
  return (
    <div className={`pt-2`}>
      <ClassSelector name="gridColumns" title="Columns" defaultValue="none" />
      <ClassSelector name="gridRows" title="Rows" defaultValue="none" />
      <RangeSelector name="gap" title="Gap" defaultValue="none" />
      <RangeSelector name="gapX" title="Gap X" defaultValue="none" />
      <RangeSelector name="gapY" title="Gap Y" defaultValue="none" />
    </div>
  );
};

export default Flex;


================================================
FILE: src/components/Sidebar/StyleManager/Layout/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";

const Layout = () => {

  return (
    <div className={`pt-2`}>
      <ClassSelector name="display" title="Layout" defaultValue="none" />
    </div>
  );
};

export default Layout;



================================================
FILE: src/components/Sidebar/StyleManager/Position/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";

const Position = () => {
  return (
    <div className={`pt-2`}>
      <ClassSelector name="position" title="Position" defaultValue="none" />
      <ClassSelector name="zIndex" title="Z-index" defaultValue="none" />
    </div>
  );
};

export default Position;



================================================
FILE: src/components/Sidebar/StyleManager/Size/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";

const Size = () => {
  return (
    <div className={`pt-2`}>
      <ClassSelector name="width" title="Width" defaultValue="auto" />
      <ClassSelector name="minWidth" title="Min width" defaultValue="0" />
      <ClassSelector name="maxWidth" title="Max width" defaultValue="none" />
      <div className="pb-3"></div>
      <ClassSelector name="height" title="Height" defaultValue="auto" />
      <ClassSelector name="minHeight" title="Min height" defaultValue="0" />
      <ClassSelector name="maxHeight" title="Max height" defaultValue="none" />
    </div>
  );
};

export default Size;



================================================
FILE: src/components/Sidebar/StyleManager/Spacing/index.jsx
================================================
import React from "react";
import SpacingSelector from "../../../StyleManager/SpacingSelector";

const Spacing = () => {
  return (
    <div className={`pt-2`}>
      <SpacingSelector />
    </div>
  );
};

export default Spacing;



================================================
FILE: src/components/Sidebar/StyleManager/Typography/index.jsx
================================================
import React from "react";
import ClassSelector from "../../../StyleManager/ClassSelector";
import AlignSelector from "../../../StyleManager/AlignSelector";

const Typography = () => {
  return (
    <div className={`pt-2`}>
      <AlignSelector name="textAlign" title="ALign" defaultValue="left"/>
      <ClassSelector name="fontSize" title="Size" defaultValue="none" />
      <ClassSelector name="textColor" title="Color" defaultValue="none" isColor />
      <ClassSelector name="fontWeight" title="Weight" defaultValue="none" />
      <ClassSelector name="letterSpacing" title="Spacing" defaultValue="none" />
      <ClassSelector name="lineHeight" title="Height" defaultValue="none" />
      <ClassSelector name="textTransform" title="Transform" defaultValue="none" />
      <ClassSelector name="fontFamily" title="Family" defaultValue="none" />
    </div>
  );
};

export default Typography;



================================================
FILE: src/components/StyleManager/AlignSelector/index.jsx
================================================
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAttribute } from "../../../redux/data-reducer";
import { useSelectedNode } from "../../../helpers";
import { clearClassNames, getResponsivePrefix } from "../../../utils";
import { classes } from "../../../configs/tailwind";
import {
  IconTextLeft,
  IconTextRight,
  IconTextCenter,
  IconTextJustify,
} from "../../Icons";

const AlignSelector = ({ title, name, isColor }) => {
  const dispatch = useDispatch();
  const selectedNode = useSelectedNode();
  const { responsiveView } = useSelector((state) => state.layout);

  const buttons = useMemo(()=>[
    {
      name: `${getResponsivePrefix(responsiveView)}text-left`,
      icon: <IconTextLeft />,
    },
    {
      name: `${getResponsivePrefix(responsiveView)}text-center`,
      icon: <IconTextCenter />,
    },
    {
      name: `${getResponsivePrefix(responsiveView)}text-right`,
      icon: <IconTextRight />,
    },
    {
      name: `${getResponsivePrefix(responsiveView)}text-justify`,
      icon: <IconTextJustify />,
    },
  ], [responsiveView]);

  const options = classes[name]
    ? classes[name].map((c) => ({
        value: `${getResponsivePrefix(responsiveView)}${c}`,
        label: `${getResponsivePrefix(responsiveView)}${c}`,
        ...(isColor ? { color: getColor(c) } : {}),
      }))
    : [];

  const isActive = (name) => {
    let isActive = false;

    selectedNode?.className?.split(" ").forEach(elm => {
      if(elm === name) isActive = true
    })

    return isActive
  };

  const onClick = (type) => {
    if (selectedNode) {
      let className = `${clearClassNames(
        selectedNode.className ? selectedNode.className : "",
        options.map((c) => c.value)
      )}`;

      className = `${className?.length ? `${className} ${type}` : type}`;

      dispatch(setAttribute("className", className));
    }
  };

  return (
    <div className={`mb-2 text-slate-800`}>
      <div className="flex items-center w-full">
        {title ? (
          <span className="uppercase text-slate-400 text-sm font-medium w-2/5 shrink-0">
            {title}
          </span>
        ) : (
          <></>
        )}
        <div
          className={`flex items-center rounded-lg bg-slate-600 overflow-hidden text-xl w-3/5 shrink-0 ${
            !selectedNode ? "pointer-events-none" : ""
          }`}
        >
          {buttons.map((button, i) => (
            <button
              key={`ba-${i}`}
              onClick={() => onClick(button.name)}
              className={`w-full ${
                isActive(button.name) ? "bg-slate-700" : ""
              } hover:bg-slate-700 hover:text-slate-200 transition flex justify-center p-2 ${
                isActive(button.name) ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {button.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlignSelector;



================================================
FILE: src/components/StyleManager/BordersSelector/BordersSelector.module.scss
================================================
$shape-size: 2rem;

.root {
  display: flex;
  align-items: center;
}

.buttonsContainer {
  width: calc(#{$shape-size} * 3 - 2px);
  height: calc(#{$shape-size} * 3 - 2px);
  flex-shrink: 0;
  position: relative;
}

.button {
  width: 2rem;
  height: 2rem;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:global(.top) {
    left: 50%;
    transform: translateX(-50%);
    top: 0;
  }
  &:global(.bottom) {
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
  }
  &:global(.left) {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &:global(.right) {
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &:global(.center) {
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}

.buttonShape {
  width: calc(100% - 6px);
  height: calc(100% - 6px);
}


================================================
FILE: src/components/StyleManager/BordersSelector/Button.jsx
================================================
import React from "react";
import styles from "./BordersSelector.module.scss";

const Button = ({ position, active, ...rest }) => {
  const getBorderStyle = () => {
    switch (position) {
      case "center":
        return "border-2";
      case "left":
        return "border-l-2";
      case "right":
        return "border-r-2";
      case "top":
        return "border-t-2";
      case "bottom":
        return "border-b-2";
    }
  };

  return (
    <div
      {...rest}
      className={`${styles.button} border ${
        active ? "border-slate-300" : "border-slate-500"
      } ${
        active ? "z-10" : "z-0"
      } hover:z-index-20 transition hover:border-slate-400 ${position}`}
    >
      <div
        className={`bg-slate-600 ${styles.buttonShape} ${getBorderStyle()} ${
          active ? "border-slate-300" : "border-slate-500"
        }`}
      ></div>
    </div>
  );
};

export default Button;



================================================
FILE: src/components/StyleManager/BordersSelector/index.jsx
================================================
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAttribute } from "../../../redux/data-reducer";
import { useSelectedNode } from "../../../helpers";
import { clearClassNames, getResponsivePrefix } from "../../../utils";
import { classes } from "../../../configs/tailwind";
import styles from "./BordersSelector.module.scss";
import Select from "../../Inputs/Select";
import Button from "./Button";
import { combinedColors } from "../../../configs/tailwind";
import { useBordersProps } from "../../../helpers";

const buttons = [
  { position: "top" },
  { position: "bottom" },
  { position: "left" },
  { position: "right" },
  { position: "center" },
];

const BordersSelector = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelectedNode();
  const [style, setStyle] = useState(null);
  const [color, setColor] = useState(null);
  const [width, setWidth] = useState(null);
  const [active, setActive] = useState("center");
  const { borderWidth, borderStyle, borderColor } = useBordersProps();
  const { responsiveView } = useSelector((state) => state.layout);

  useEffect(() => {
    setWidth(borderWidth ? { value: borderWidth, label: borderWidth } : null);
    setStyle(borderStyle ? { value: borderStyle, label: borderStyle } : null);
    setColor(
      borderColor
        ? {
            value: borderColor,
            label: borderColor,
            color: getColor(borderColor),
          }
        : null
    );
    if (borderColor) setActive(getPosition(borderColor));
  }, [borderWidth, borderStyle, borderColor]);

  useEffect(() => {
    if (!selectedNode) setActive("center");
  }, [selectedNode, borderColor]);

  useEffect(() => {
    if (selectedNode && style) {
      let className = `${clearClassNames(
        selectedNode.className ? selectedNode.className : "",
        classes.borderStyle.map(
          (c) => `${getResponsivePrefix(responsiveView)}${c}`
        )
      )}`;

      className = `${
        className?.length ? `${className} ${style.value}` : style.value
      }`;

      dispatch(setAttribute("className", className));
    }
  }, [style]);

  useEffect(() => {
    if (selectedNode && width) {
      let className = `${clearClassNames(
        selectedNode.className ? selectedNode.className : "",
        classes.borderWidth.map(
          (c) => `${getResponsivePrefix(responsiveView)}${c}`
        )
      )}`;

      className = `${
        className?.length ? `${className} ${width.value}` : width.value
      }`;

      dispatch(setAttribute("className", className));
    }
  }, [width]);

  useEffect(() => {
    if (selectedNode && color) {
      let className = `${clearClassNames(
        selectedNode.className ? selectedNode.className : "",
        classes[getColorClass()].map(
          (c) => `${getResponsivePrefix(responsiveView)}${c}`
        )
      )}`;

      className = `${
        className?.length ? `${className} ${color.value}` : color.value
      }`;

      dispatch(setAttribute("className", className));
    }
  }, [color]);

  const getPosition = (name) => {
    if (name.includes("border-r")) return "right";
    if (name.includes("border-l")) return "left";
    if (name.includes("border-t")) return "top";
    if (name.includes("border-b")) return "bottom";
    return "center";
  };

  const getColorClass = () => {
    switch (active) {
      case "center":
        return "borderColor";
      case "left":
        return "borderLColor";
      case "right":
        return "borderRColor";
      case "top":
        return "borderTColor";
      case "bottom":
        return "borderBColor";
    }
  };

  const getColor = (item) => {
    let c = null;

    if (item) {
      const colorParts = item
        .replace(`${getResponsivePrefix(responsiveView)}border-t-`, "")
        .replace(`${getResponsivePrefix(responsiveView)}border-b-`, "")
        .replace(`${getResponsivePrefix(responsiveView)}border-l-`, "")
        .replace(`${getResponsivePrefix(responsiveView)}border-r-`, "")
        .replace(`${getResponsivePrefix(responsiveView)}border-x-`, "")
        .replace(`${getResponsivePrefix(responsiveView)}border-y-`, "")
        .replace(`${getResponsivePrefix(responsiveView)}border-`, "")
        .split("-");

      c =
        colorParts.length > 1
          ? combinedColors[colorParts[0]][colorParts[1]]
          : combinedColors[colorParts[0]];
    }

    return c;
  };

  return (
    <div className={`${styles.root}`}>
      <div className="w-2/5 relative">
        <div className={`${styles.buttonsContainer}`}>
          {buttons.map((button, i) => (
            <Button
              active={active === button.position}
              onClick={() => setActive(button.position)}
              position={button.position}
              key={`bbi-${i}`}
            />
          ))}
        </div>
      </div>
      <div className="w-3/5">
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? style : null}
          onChange={setStyle}
          options={classes.borderStyle.map((item) => ({
            value: `${getResponsivePrefix(responsiveView)}${item}`,
            label: `${getResponsivePrefix(responsiveView)}${item}`,
          }))}
          placeholder={selectedNode ? "none" : "Select"}
          className="mb-2"
          label={`Style`}
        />
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? color : null}
          onChange={setColor}
          options={classes[getColorClass()].map((item) => ({
            value: `${getResponsivePrefix(responsiveView)}${item}`,
            label: `${getResponsivePrefix(responsiveView)}${item}`,
            color: getColor(`${getResponsivePrefix(responsiveView)}${item}`),
          }))}
          placeholder={selectedNode ? "none" : "Select"}
          className="mb-2"
          isColor
          isSimpleColor
          label={`Color`}
        />
        <Select
          isDisabled={!selectedNode}
          value={selectedNode ? width : null}
          onChange={setWidth}
          options={classes.borderWidth.map((item) => ({
            value: `${getResponsivePrefix(responsiveView)}${item}`,
            label: `${getResponsivePrefix(responsiveView)}${item}`,
          }))}
          placeholder={selectedNode ? "none" : "Select"}
          className="mb-2"
          label={`Width`}
        />
      </div>
    </div>
  );
};

export default BordersSelector;



================================================
FILE: src/components/StyleManager/ClassSelector/index.jsx
================================================
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../Inputs/Select";
import { setAttribute } from "../../../redux/data-reducer";
import { useSelectedNode } from "../../../helpers";
import { clearClassNames, getResponsivePrefix } from "../../../utils";
import { classes, combinedColors } from "../../../configs/tailwind";

const ClassSelector = ({ title, name, defaultValue, isColor }) => {
  const [selectedOption, setSelectedOption] = useState({
    value: defaultValue,
    label: defaultValue,
  });
  const [isDefault, setIsDefault] = useState(true);
  const dispatch = useDispatch();
  const selectedNode = useSelectedNode();
  const { responsiveView } = useSelector((state) => state.layout);

  const getColor = (name) => {
    if (name) {
      const parts = name.split("-");
      return parts.length > 2
        ? combinedColors[parts[1]][parts[2]]
        : combinedColors[parts[1]];
    }
  };

  const options = useMemo(
    () => [
      ...(classes[name]
        ? classes[name].map((c) => ({
            value: `${getResponsivePrefix(responsiveView)}${c}`,
            label: `${getResponsivePrefix(responsiveView)}${c}`,
            ...(isColor ? { color: getColor(c) } : {}),
          }))
        : []),
    ],
    [responsiveView, classes, name]
  );

  useEffect(() => {
    if (selectedNode) {
      if (selectedNode?.className) {
        let option = null;
        selectedNode?.className?.split(" ").map((c) => {
          const index = options.map((c) => c.value).indexOf(c);
          if (index !== -1) option = options[index];
        });

        if (option) {
          setSelectedOption(option);
          setIsDefault(false);
        } else {
          setSelectedOption({ value: defaultValue, label: defaultValue });
          setIsDefault(true);
        }
      } else {
        setSelectedOption({ value: defaultValue, label: defaultValue });
        setIsDefault(true);
      }
    }
  }, [selectedNode, responsiveView]);

  const onChange = (e) => {
    setSelectedOption(e);

    let className = `${clearClassNames(
      selectedNode.className ? selectedNode.className : "",
      options.map((c) => c.value)
    )}`;

    className = `${className?.length ? `${className} ${e.value}` : e.value}`;

    dispatch(setAttribute("className", className));
  };

  return (
    <div className={`mb-2 text-slate-800`}>
      <Select
        isDisabled={!selectedNode}
        value={selectedNode ? selectedOption : null}
        onChange={onChange}
        options={options}
        isDefault={isDefault}
        placeholder={"Select"}
        label={title}
        isColor={isColor}
      />
    </div>
  );
};

export default ClassSelector;



================================================
FILE: src/components/StyleManager/ImageSelector/index.jsx
================================================
import React, { useEffect, useState } from "react";
import { useSelectedNode } from "../../../helpers";
import { IconPlus } from "../../Icons";
import { button } from "../../../styles/classes";
import { openModal } from "../../../redux/modals-reducer";
import { useDispatch } from "react-redux";

const ImageSelector = () => {
  const selectedNode = useSelectedNode();
  const dispatch = useDispatch();

  return (
    <div
      className={`mb-2 text-slate-800 flex items-center justify-between w-full`}
    >
      <span className="uppercase text-slate-400 text-sm font-medium w-2/5 shrink-0">
        Image
      </span>
      <button
        onClick={() =>
          selectedNode ? dispatch(openModal("mediaLibrary")) : null
        }
        className={`${button}`}
      >
        <IconPlus />
      </button>
    </div>
  );
};

export default ImageSelector;



================================================
FILE: src/components/StyleManager/PropertySelector/index.jsx
================================================
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAttribute, setSelectedSection } from "../../../redux/data-reducer";
import { useSelectedNode } from "../../../helpers";
import Label from "../../Inputs/Label";
import Input from "../../Inputs/Input";
import TextArea from "../../Inputs/TextArea";

const PropertySelector = ({ property, isTextArea, label }) => {
  const dispatch = useDispatch();
  const selectedNode = useSelectedNode();

  return (
    <div className={`mb-2 ${!isTextArea ? "flex items-center" : ""} text-slate-800`}>
      <Label className={`${isTextArea ? "mt-2 mb-2 block" : ""}`}>{label ? label : property}</Label>
      {isTextArea ? (
        <TextArea
          disabled={!selectedNode}
          onChange={(e) => {
            const sn = { ...selectedNode, id: e.target.value };

            if (property === "id") {
              setTimeout(() => {
                dispatch(setSelectedSection(sn));
              }, 10);
            }

            dispatch(setAttribute(property, e.target.value));
          }}
          value={selectedNode ? selectedNode[property] ? selectedNode[property] : "" : ""}
        />
      ) : (
        <Input
          disabled={!selectedNode}
          onChange={(e) => {
            const sn = { ...selectedNode, id: e.target.value };

            if (property === "id") {
              setTimeout(() => {
                dispatch(setSelectedSection(sn));
              }, 10);
            }

            dispatch(setAttribute(property, e.target.value));
          }}
          value={selectedNode ? selectedNode[property] ? selectedNode[property] : "" : ""}
        />
      )}
    </div>
  );
};

export default PropertySelector;



================================================
FILE: src/components/StyleManager/RangeSelector/index.jsx
================================================
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAttribute } from "../../../redux/data-reducer";
import { useSelectedNode } from "../../../helpers";
import { clearClassNames, getResponsivePrefix } from "../../../utils";
import { classes } from "../../../configs/tailwind";
import Label from "../../Inputs/Label";
import styles from "./RangeSelector.module.scss";

const RangeSelector = ({ title, name, defaultValue }) => {
  const [selectedOption, setSelectedOption] = useState(-1);
  const [isDefault, setIsDefault] = useState(true);
  const dispatch = useDispatch();
  const selectedNode = useSelectedNode();
  const { responsiveView } = useSelector((state) => state.layout);

  const options = useMemo(
    () => [
      ...(classes[name]
        ? classes[name].map((c) => ({
            value: `${getResponsivePrefix(responsiveView)}${c}`,
            label: `${getResponsivePrefix(responsiveView)}${c}`,
          }))
        : []),
    ],
    [responsiveView, classes, name]
  );

  useEffect(() => {
    if (selectedNode) {
      if (selectedNode?.className) {
        let option = 0;
        selectedNode?.className?.split(" ").map((c) => {
          const index = options.map((c, i) => c.value).indexOf(c);
          if (index !== -1) option = index;
        });

        if (option) {
          setSelectedOption(option);
          setIsDefault(false);
        } else {
          setSelectedOption(-1);
          setIsDefault(true);
        }
      } else {
        setSelectedOption(-1);
        setIsDefault(true);
      }
    }
  }, [selectedNode, responsiveView]);

  const onChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(e.target.value, options);

    let className = `${clearClassNames(
      selectedNode.className ? selectedNode.className : "",
      options.map((c) => c.value)
    )}`;

    if (e.target.value >= 0) {
      className = `${
        className?.length
          ? `${className} ${options[e.target.value].value}`
          : options[e.target.value].value
      }`;
    }

    dispatch(setAttribute("className", className));
  };

  return (
    <div className={`flex items-center text-slate-800 py-3`}>
      {title ? <Label>{title}</Label> : <></>}
      <input
        disabled={!selectedNode}
        type="range"
        min="-1"
        className={`${styles.thumb} w-full h-2 bg-slate-500 rounded-lg appearance-none cursor-pointer dark:bg-slate-700`}
        max={options.length - 1}
        onChange={onChange}
        value={selectedNode ? selectedOption : 0}
      />
    </div>
  );
};

export default RangeSelector;



================================================
FILE: src/components/StyleManager/RangeSelector/RangeSelector.module.scss
================================================
@import "../../../styles//variables.scss";

.thumb {
  &::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: $light;
    cursor: pointer;
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: $light;
    cursor: pointer;
  }
}



================================================
FILE: src/components/StyleManager/SpacingSelector/index.jsx
================================================
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAttribute } from "../../../redux/data-reducer";
import { useSelectedNode } from "../../../helpers";
import {
  clearClassNames,
  getClassByPartOfName,
  clearClassNamesByPartOfName,
  getResponsivePrefix,
} from "../../../utils";
import { classes } from "../../../configs/tailwind";
import styles from "./SpacingSelector.module.scss";
import Select from "../../../components/Inputs/Select";
import SidebarModal from "../../Modals/SidebarModal";

const cls = {
  button:
    "focus:bg-slate-500 hover:bg-slate-500 rounded transition text-slate-200 text-sm",
};

const SpacingSelector = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelectedNode();
  const [active, setActive] = useState(null);
  const [selectedOption, setSelectedOption] = useState({
    pt: null,
    pb: null,
    pl: null,
    pr: null,
    mt: null,
    mb: null,
    ml: null,
    mr: null,
  });
  const { responsiveView } = useSelector((state) => state.layout);

  const options1 = useMemo(
    () => [
      ...(active
        ? classes[active].map((c) => ({
            value: `${getResponsivePrefix(responsiveView)}${c}`,
            label: `${getResponsivePrefix(responsiveView)}${c}`,
          }))
        : []),
    ],
    [responsiveView, active, classes]
  );

  const options2 = useMemo(
    () => [
      ...(active
        ? classes[
            active?.includes("margin")
              ? active?.includes("marginLeft") ||
                active?.includes("marginRight")
                ? "marginX"
                : "marginY"
              : active?.includes("paddingLeft") ||
                active?.includes("paddingRight")
              ? "paddingX"
              : "paddingY"
          ].map((c) => ({
            value: `${getResponsivePrefix(responsiveView)}${c}`,
            label: `${getResponsivePrefix(responsiveView)}${c}`,
          }))
        : []),
    ],
    [responsiveView, active, classes]
  );

  const options3 = useMemo(
    () => [
      ...(active
        ? classes[active?.includes("margin") ? "margin" : "padding"].map(
            (c) => ({
              value: `${getResponsivePrefix(responsiveView)}${c}`,
              label: `${getResponsivePrefix(responsiveView)}${c}`,
            })
          )
        : []),
    ],
    [responsiveView, active, classes]
  );

  useEffect(() => {
    if (selectedNode) {
      clear();
      if (selectedNode?.className) {
        selectedNode?.className?.split(" ").map((c) => {
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}pt-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}pt-`);
            setSelectedOption((c) => ({
              ...c,
              pt: v[1],
            }));
          }
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}pb-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}pb-`);
            setSelectedOption((c) => ({
              ...c,
              pb: v[1],
            }));
          }
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}pl-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}pl-`);
            setSelectedOption((c) => ({
              ...c,
              pl: v[1],
            }));
          }
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}pr-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}pr-`);
            setSelectedOption((c) => ({
              ...c,
              pr: v[1],
            }));
          }
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}mt-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}mt-`);
            setSelectedOption((c) => ({
              ...c,
              mt: v[1],
            }));
          }
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}mb-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}mb-`);
            setSelectedOption((c) => ({
              ...c,
              mb: v[1],
            }));
          }
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}ml-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}ml-`);
            setSelectedOption((c) => ({
              ...c,
              ml: v[1],
            }));
          }
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}mr-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}mr-`);
            setSelectedOption((c) => ({
              ...c,
              mr: v[1],
            }));
          }
          if (c.indexOf(`${getResponsivePrefix(responsiveView)}p-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}p-`);
            setSelectedOption((c) => ({
              ...c,
              pt: v[1],
              pb: v[1],
              pl: v[1],
              pr: v[1],
            }));
          }

          if (c.indexOf(`${getResponsivePrefix(responsiveView)}m-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}m-`);
            setSelectedOption((c) => ({
              ...c,
              mt: v[1],
              mb: v[1],
              ml: v[1],
              mr: v[1],
            }));
          }

          if (c.indexOf(`${getResponsivePrefix(responsiveView)}py-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}py-`);
            setSelectedOption((c) => ({
              ...c,
              pt: v[1],
              pb: v[1],
            }));
          }

          if (c.indexOf(`${getResponsivePrefix(responsiveView)}my-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}my-`);
            setSelectedOption((c) => ({
              ...c,
              mt: v[1],
              mb: v[1],
            }));
          }

          if (c.indexOf(`${getResponsivePrefix(responsiveView)}px-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}px-`);
            setSelectedOption((c) => ({
              ...c,
              pl: v[1],
              pr: v[1],
            }));
          }

          if (c.indexOf(`${getResponsivePrefix(responsiveView)}mx-`) === 0) {
            const v = c.split(`${getResponsivePrefix(responsiveView)}mx-`);
            setSelectedOption((c) => ({
              ...c,
              ml: v[1],
              mr: v[1],
            }));
          }
        });
      } else {
        clear();
      }
    } else {
      clear();
    }
  }, [selectedNode, responsiveView]);

  const clear = () =>
    setSelectedOption({
      pt: null,
      pb: null,
      pl: null,
      pr: null,
      mt: null,
      mb: null,
      ml: null,
      mr: null,
    });

  const onChange = (e, partOfName) => {
    if (selectedNode) {
      let className = clearClassNamesByPartOfName(
        selectedNode.className,
        partOfName
      );

      className = `${className?.length ? `${className} ${e.value}` : e.value}`;

      dispatch(setAttribute("className", className));
    }
  };

  const isMargin = () => active?.includes("margin");
  const removeName = () => active?.replace("margin", "").replace("padding", "");

  const getOption = (name) => {
    const className = getClassByPartOfName(
      `${selectedNode.className}`,
      `${getResponsivePrefix(responsiveView)}${name}`
    );
    return className
      ? {
          value: className,
          label: className,
        }
      : null;
  };

  const getSelected = (type) => {
    switch (type) {
      case "Top":
        return getOption(isMargin() ? "mt-" : "pt-");
      case "Bottom":
        return getOption(isMargin() ? "mb-" : "pb-");
      case "Left":
        return getOption(isMargin() ? "ml-" : "pl-");
      case "Right":
        return getOption(isMargin() ? "mr-" : "pr-");
      case "Y":
        return getOption(isMargin() ? "my-" : "py-");
      case "X":
        return getOption(isMargin() ? "mx-" : "px-");
      case "all":
        return getOption(isMargin() ? "m-" : "p-");
    }

    return null;
  };

  const XorY = () => {
    return active?.includes("marginLeft") ||
      active?.includes("marginRight") ||
      active?.includes("paddingLeft") ||
      active?.includes("paddingRight")
      ? "x"
      : "y";
  };

  return (
    <div
      className={`${styles.root} mb-2 text-slate-800 h-36 relative rounded-lg bg-slate-600`}
    >
      <SidebarModal active={active} onClose={() => setActive(null)}>
        <div className="flex items-center w-full mb-2">
          <span className="uppercase text-slate-400 text-xs font-medium w-2/4 shrink-0">
            {active?.includes("margin") ? "Margin" : "Padding"}-{removeName()}
          </span>
          <Select
            isDisabled={!selectedNode}
            value={selectedNode ? getSelected(removeName()) : null}
            onChange={(e) =>
              onChange(
                e,
                isMargin()
                  ? `${getResponsivePrefix(responsiveView)}m${
                      removeName().toLowerCase()[0]
                    }-`
                  : `${getResponsivePrefix(responsiveView)}p${
                      removeName().toLowerCase()[0]
                    }-`
              )
            }
            options={options1}
            className="w-full"
            placeholder={"Select"}
          />
        </div>
        <div className="flex items-center w-full mb-2">
          <span className="uppercase text-slate-400 text-xs font-medium w-2/4 shrink-0">
            {active?.includes("margin") ? "Margin" : "Padding"}{" "}
            {XorY().toUpperCase()}
            -axis
          </span>
          <Select
            isDisabled={!selectedNode}
            value={selectedNode ? getSelected(XorY().toUpperCase()) : null}
            onChange={(e) =>
              onChange(
                e,
                isMargin()
                  ? `${getResponsivePrefix(responsiveView)}m${XorY()}-`
                  : `${getResponsivePrefix(responsiveView)}p${XorY()}-`
              )
            }
            options={options2}
            className="w-full"
            placeholder={"Select"}
          />
        </div>
        <div className="flex items-center w-full">
          <span className="uppercase text-slate-400 text-xs font-medium w-2/4 shrink-0">
            {active?.includes("margin") ? "Margin" : "Padding"} All
          </span>
          <Select
            isDisabled={!selectedNode}
            value={selectedNode ? getSelected("all") : null}
            onChange={(e) =>
              onChange(
                e,
                isMargin()
                  ? `${getResponsivePrefix(responsiveView)}m-`
                  : `${getResponsivePrefix(responsiveView)}p-`
              )
            }
            options={options3}
            className="w-full"
            placeholder={"Select"}
          />
        </div>
      </SidebarModal>
      <div className={`w-full h-full absolute top-0 left-0`}>
        <div className="ps-4">
          <span className="uppercase text-slate-400 text-xs font-medium">
            Margin
          </span>
        </div>
        <input
          className={`${styles.button} ${cls.button} tr-left left-1/2 top-1`}
          value={selectedOption.mt ? selectedOption.mt : 0}
          onFocus={() => setActive("marginTop")}
          type="text"
        />
        <input
          className={`${styles.button} ${cls.button} tr-top left-1 top-1/2`}
          value={selectedOption.ml ? selectedOption.ml : 0}
          onFocus={() => setActive("marginLeft")}
          type="text"
        />
        <input
          className={`${styles.button} ${cls.button} tr-top right-1 top-1/2`}
          value={selectedOption.mr ? selectedOption.mr : 0}
          onFocus={() => setActive("marginRight")}
          type="text"
        />
        <input
          className={`${styles.button} ${cls.button} tr-left bottom-1 left-1/2`}
          value={selectedOption.mb ? selectedOption.mb : 0}
          onFocus={() => setActive("marginBottom")}
          type="text"
        />

        <div
          className={`${styles.padding} rounded-lg border-4 border-slate-800`}
        >
          <div className="ps-4">
            <span className="uppercase text-slate-400 text-xs font-medium">
              Padding
            </span>
          </div>
          <input
            className={`${styles.button} ${cls.button} tr-left left-1/2 top-1`}
            value={selectedOption.pt ? selectedOption.pt : 0}
            onFocus={() => setActive("paddingTop")}
            type="text"
          />
          <input
            className={`${styles.button} ${cls.button} tr-top left-1 top-1/2`}
            value={selectedOption.pl ? selectedOption.pl : 0}
            onFocus={() => setActive("paddingLeft")}
            type="text"
          />
          <input
            className={`${styles.button} ${cls.button} tr-top right-1 top-1/2`}
            value={selectedOption.pr ? selectedOption.pr : 0}
            onFocus={() => setActive("paddingRight")}
            type="text"
          />
          <input
            className={`${styles.button} ${cls.button} tr-left bottom-1 left-1/2`}
            value={selectedOption.pb ? selectedOption.pb : 0}
            onFocus={() => setActive("paddingBottom")}
            type="text"
          />
          <div className={`${styles.shape} bg-slate-800`}></div>
        </div>
      </div>
    </div>
  );
};

export default SpacingSelector;



================================================
FILE: src/components/StyleManager/SpacingSelector/SpacingSelector.module.scss
================================================
@import "../../../../src/styles/variables.scss";

.root {
  width: 100%;
}

.button {
  background-color: transparent;
  outline: none;
  position: absolute;
  width: 20px;
  text-align: center;

  &:global(.tr-left) {
    transform: translateX(-50%);
  }
  &:global(.tr-top) {
    transform: translateY(-50%);
  }
}

.padding {
  position: absolute;
  width: calc(100% - 60px);
  height: calc(100% - 56px);
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.shape {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 80px;
  height: 10px;
  border-radius: 20px;
}


================================================
FILE: src/components/StyleManager/SrcSelector/index.jsx
================================================
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAttribute } from "../../../redux/data-reducer";
import { useSelectedNode } from "../../../helpers";
import Label from "../../Inputs/Label";
import { useDropzone } from "react-dropzone";
import { toBase64 } from "../../../utils";

const SrcSelector = ({ property, label }) => {
  const dispatch = useDispatch();
  const selectedNode = useSelectedNode();

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    acceptedFiles.map((file)=>{
      toBase64(file).then((data)=>{
        dispatch(setAttribute(property, data));
      })
    })
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg": [],
    },
    multiple: false,
    onDrop,
  });

  return (
    <div className={`mb-2`}>
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "border-slate-200" : "border-slate-500"
        } transition p-5 flex items-center justify-center border h-40 rounded my-5 w-full text-center`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop image here ...</p>
        ) : (
          <p>Drag 'n' drop image here, or click to select file</p>
        )}
      </div>
    </div>
  );
};

export default SrcSelector;



================================================
FILE: src/components/StyleManager/TagSelector/index.jsx
================================================
import React, { useEffect } from "react";
import Select from "../../Inputs/Select";
import { getMoreTags } from "../../../utils";
import { useSelectedNode } from "../../../helpers";
import { useDispatch } from "react-redux";
import { setAttribute } from "../../../redux/data-reducer";

const TagSelector = () => {
  const selectedNode = useSelectedNode();
  const dispatch = useDispatch();

  return (
    selectedNode && (
      <Select
        value={{ value: selectedNode.tagName, label: selectedNode.tagName }}
        className="w-full mt-2"
        onChange={(e) => dispatch(setAttribute("tagName", e.value))}
        options={getMoreTags(selectedNode.tagName).map((item) => ({
          value: item,
          label: item,
        }))}
      />
    )
  );
};

export default TagSelector;



================================================
FILE: src/configs/index.js
================================================
export const defaultConfig = {
  blocks: [
    {
      label: "Div",
      content: `<div></div>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><path d="M58,2c2.2,0,4,1.8,4,4v52c0,2.2-1.8,4-4,4H6c-2.2,0-4-1.8-4-4V6c0-2.2,1.8-4,4-4H58 M58,0H6C2.7,0,0,2.7,0,6v52c0,3.3,2.7,6,6,6h52c3.3,0,6-2.7,6-6V6C64,2.7,61.3,0,58,0L58,0z"/></svg>',
    },
    {
      label: "Columns 3",
      attributes: { class: "grid gap-x-4 gap-y-4 grid-cols-3" },
      content: `<div><div class="p-3"></div><div class="p-3"></div><div class="p-3"></div></div>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><path d="M13.3,2c1.6,0,2.8,1.3,2.8,2.8v54.4c0,1.6-1.3,2.8-2.8,2.8H4.8C3.3,62,2,60.7,2,59.2V4.8C2,3.3,3.3,2,4.8,2H13.3 M13.3,0H4.8C2.2,0,0,2.2,0,4.8v54.4C0,61.8,2.2,64,4.8,64h8.5c2.7,0,4.8-2.2,4.8-4.8V4.8C18.2,2.2,16,0,13.3,0L13.3,0z"/><path d="M59.2,2C60.7,2,62,3.3,62,4.8v54.4c0,1.6-1.3,2.8-2.8,2.8h-8.5c-1.6,0-2.8-1.3-2.8-2.8V4.8c0-1.6,1.3-2.8,2.8-2.8H59.2M59.2,0h-8.5c-2.7,0-4.8,2.2-4.8,4.8v54.4c0,2.7,2.2,4.8,4.8,4.8h8.5c2.7,0,4.8-2.2,4.8-4.8V4.8C64,2.2,61.8,0,59.2,0L59.2,0z"/><path d="M36.3,2c1.6,0,2.8,1.3,2.8,2.8v54.4c0,1.6-1.3,2.8-2.8,2.8h-8.5c-1.6,0-2.8-1.3-2.8-2.8V4.8c0-1.6,1.3-2.8,2.8-2.8H36.3M36.3,0h-8.5c-2.7,0-4.8,2.2-4.8,4.8v54.4c0,2.7,2.2,4.8,4.8,4.8h8.5c2.7,0,4.8-2.2,4.8-4.8V4.8C41.1,2.2,38.9,0,36.3,0L36.3,0z"/></svg>',
    },
    {
      label: "Text",
      content: `<span>Text</span>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="64px" height="64px" viewBox="0 0 64 64"><path d="M12,21.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,23.7,12,22.9,12,21.9z M12,31.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,33.7,12,32.9,12,31.9z M12,41.9c0-1,0.9-1.8,2-1.8h24c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,43.7,12,42.9,12,41.9z"/><path d="M58.5,11.2c1.4,0,2.5,1.1,2.5,2.5v37c0,1.4-1.1,2.5-2.5,2.5h-53C4.1,53.2,3,52,3,50.7v-37c0-1.4,1.1-2.5,2.5-2.5H58.5M58.5,8.2h-53c-3,0-5.5,2.5-5.5,5.5v37c0,3,2.5,5.5,5.5,5.5h53c3,0,5.5-2.5,5.5-5.5v-37C64,10.6,61.5,8.2,58.5,8.2L58.5,8.2z"/></svg>',
    },
    {
      label: "Paragraph",
      content: `<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="64px" height="64px" viewBox="0 0 64 64"><path d="M12,21.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,23.7,12,22.9,12,21.9z M12,31.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,33.7,12,32.9,12,31.9z M12,41.9c0-1,0.9-1.8,2-1.8h24c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,43.7,12,42.9,12,41.9z"/><path d="M58.5,11.2c1.4,0,2.5,1.1,2.5,2.5v37c0,1.4-1.1,2.5-2.5,2.5h-53C4.1,53.2,3,52,3,50.7v-37c0-1.4,1.1-2.5,2.5-2.5H58.5M58.5,8.2h-53c-3,0-5.5,2.5-5.5,5.5v37c0,3,2.5,5.5,5.5,5.5h53c3,0,5.5-2.5,5.5-5.5v-37C64,10.6,61.5,8.2,58.5,8.2L58.5,8.2z"/></svg>',
    },
    {
      label: "Container",
      attributes: { class: "container mx-auto" },
      content: `<div></div>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><path d="M58,2c2.2,0,4,1.8,4,4v52c0,2.2-1.8,4-4,4H6c-2.2,0-4-1.8-4-4V6c0-2.2,1.8-4,4-4H58 M58,0H6C2.7,0,0,2.7,0,6v52c0,3.3,2.7,6,6,6h52c3.3,0,6-2.7,6-6V6C64,2.7,61.3,0,58,0L58,0z"/></svg>',
    },
    {
      label: "Card",
      attributes: { class: "container mx-auto" },
      content: `  <div class="flex justify-center items-center">
      <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">Card Title</div>
          <p class="text-white text-base">This is the description of the card.</p>
        </div>
        <div class="px-6 py-4">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Button
          </button>
        </div>
      </div>
    </div>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="64px" height="64px" viewBox="0 0 64 64"><path d="M12,21.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,23.7,12,22.9,12,21.9z M12,31.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,33.7,12,32.9,12,31.9z M12,41.9c0-1,0.9-1.8,2-1.8h24c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,43.7,12,42.9,12,41.9z"/><path d="M58.5,11.2c1.4,0,2.5,1.1,2.5,2.5v37c0,1.4-1.1,2.5-2.5,2.5h-53C4.1,53.2,3,52,3,50.7v-37c0-1.4,1.1-2.5,2.5-2.5H58.5M58.5,8.2h-53c-3,0-5.5,2.5-5.5,5.5v37c0,3,2.5,5.5,5.5,5.5h53c3,0,5.5-2.5,5.5-5.5v-37C64,10.6,61.5,8.2,58.5,8.2L58.5,8.2z"/></svg>',
    },
    {
      label: "Button",
      attributes: { class: "inline-flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" },
      content: `<button>Button</button>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><path d="M0,28c0-3.3,2.7-6,6-6h52c3.3,0,6,2.7,6,6v8c0,3.3-2.7,6-6,6H6c-3.3,0-6-2.7-6-6V28z M6,26c-1.1,0-2,0.9-2,2v8c0,1.1,0.9,2,2,2h52c1.1,0,2-0.9,2-2v-8c0-1.1-0.9-2-2-2H6z"/><path d="M54,30H42h-8h-4h-8H10c-1.1,0-2,0.9-2,2s0.9,2,2,2h12h8h4h8h12c1.1,0,2-0.9,2-2S55.1,30,54,30z"/></svg>',
    },
    {
      label: "Divider",
      attributes: { class: "mt-4 mb-4" },
      content: `<hr/>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><path d="M62,30H50h-4h-4h-4h-4h-4h-4h-4h-4h-4H2c-1.1,0-2,0.9-2,2s0.9,2,2,2h12h4h4h4h4h4h4h4h4h4h12c1.1,0,2-0.9,2-2S63.1,30,62,30z"/></svg>'
    },
    {
      label: "Headline",
      content: `<h1>Headline</h1>`,
      attributes: { class: "text-5xl font-bold leading-snug" },
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><g><path d="M57.1,10.3c-6,0.6-6.6,0.9-6.6,7v28.9c0,6,0.6,6.3,6.6,6.9v2H37.8v-2c6-0.7,6.6-0.9,6.6-6.9V31.8H19.7v14.4c0,6,0.6,6.2,6.5,6.9v2H7v-2c5.8-0.6,6.5-0.9,6.5-6.9V17.3c0-6-0.6-6.4-6.5-7v-2h19.2v2c-5.8,0.5-6.5,1-6.5,7v11.4h24.6V17.3c0-6-0.8-6.5-6.6-7v-2h19.3V10.3z"/></g></svg>'
    },
    {
      label: "Link",
      content: `<a href="example.com">Link</a>`,
      attributes: { class: "font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline" },
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><g><path d="M24.5,18.3H13.7C6.1,18.3,0,24.4,0,32s6.1,13.7,13.7,13.7h13.7c7.6,0,13.7-6.1,13.7-13.7c0-1.6-0.3-3.1-0.8-4.6h-3.8c-0.4,0-0.8,0-1.1,0.1c2.4,4.4,0.8,10-3.6,12.4c-1.4,0.8-2.9,1.1-4.4,1.1H13.7c-5,0-9.1-4.1-9.1-9.1s4.1-9.1,9.1-9.1h7C21.7,21.1,23,19.6,24.5,18.3L24.5,18.3z"/><path d="M36.6,18.3c-7.6,0-13.7,6.1-13.7,13.7c0,1.6,0.3,3.1,0.8,4.6h5c-2.5-4.4-1-10,3.3-12.5c1.4-0.8,3-1.2,4.6-1.2h13.7c5,0,9.1,4.1,9.1,9.1s-4.1,9.1-9.1,9.1h-7c-1,1.7-2.3,3.3-3.7,4.6h10.8C57.9,45.7,64,39.6,64,32s-6.1-13.7-13.7-13.7H36.6z"/></g></svg>'
    },
    {
      label: "Image",
      content: `<img src="data:image/jpeg;base64,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I1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBywAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQASwAAAABAAEBLAAAAAEAAThCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQPyAAAAAAAKAAD///////8AADhCSU0EDQAAAAAABAAAAB44QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAE4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA00AAAAGAAAAAAAAAAAAAAQ4AAAHgAAAAAwAYgBsAHUAZQAtAHAAYQB0AHQAZQByAG4AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAB4AAAAQ4AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAA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NTI6MTMgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi4zIChNYWNpbnRvc2gpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0wNC0xM1QxNjoxMzozNC0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDQtMTNUMTY6MzM6MDctMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDQtMTNUMTY6MzM6MDctMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOkxlZ2FjeUlQVENEaWdlc3Q9IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N2M2MzBhNGQtMTNmZS00ZDZlLWE3MjUtNzhkZjJhNjc0N2Y0IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MmMyNTgwNTItNGZkNS05YzQzLWFiZDktNGFlNmUwNWM0YWM5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTZiNGYyNDItNjM4OS00NjdjLTk5YmMtYTBmYmI1ZDA2NjlhIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNmI0ZjI0Mi02Mzg5LTQ2N2MtOTliYy1hMGZiYjVkMDY2OWEiIHN0RXZ0OndoZW49IjIwMjEtMDQtMTNUMTY6MTM6MzQtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4zIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gaW1hZ2UvcG5nIHRvIGltYWdlL2pwZWciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg5NjMxNDJkLWZhNjEtNDVhNC04MTllLTE2ZjM3MjNjMTk5NyIgc3RFdnQ6d2hlbj0iMjAyMS0wNC0xM1QxNjoyOToxOC0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjdjNjMwYTRkLTEzZmUtNGQ2ZS1hNzI1LTc4ZGYyYTY3NDdmNCIgc3RFdnQ6d2hlbj0iMjAyMS0wNC0xM1QxNjozMzowNy0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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"/>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><g><path d="M37.2,23.4c0,2.9-2.3,5.2-5.2,5.2s-5.2-2.3-5.2-5.2s2.3-5.2,5.2-5.2S37.2,20.5,37.2,23.4z"/><path d="M9.6,11.3c-2.9,0-5.2,2.3-5.2,5.2v31c0,2.9,2.3,5.2,5.2,5.2h44.8c2.9,0,5.2-2.3,5.2-5.2v-31c0-2.9-2.3-5.2-5.2-5.2H9.6zM54.4,14.8c1,0,1.7,0.8,1.7,1.7v20.7l-13-6.7c-0.7-0.3-1.5-0.2-2,0.3L28.3,43.6l-9.2-6.1c-0.7-0.5-1.6-0.4-2.2,0.2l-9.1,8.1v1.9c0,0,0-0.1,0-0.1v-31c0-1,0.8-1.7,1.7-1.7H54.4z"/></g></svg>'
    },
    {
      label: "List",
      attributes: { class: "list-disc pl-5" },
      content: `<ul><li>List item 1</li><li>List item 2</li><li>List item 3</li></ul>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="64px" height="64px" viewBox="0 0 64 64"><path d="M12,21.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,23.7,12,22.9,12,21.9z M12,31.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,33.7,12,32.9,12,31.9z M12,41.9c0-1,0.9-1.8,2-1.8h24c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,43.7,12,42.9,12,41.9z"/><path d="M58.5,11.2c1.4,0,2.5,1.1,2.5,2.5v37c0,1.4-1.1,2.5-2.5,2.5h-53C4.1,53.2,3,52,3,50.7v-37c0-1.4,1.1-2.5,2.5-2.5H58.5M58.5,8.2h-53c-3,0-5.5,2.5-5.5,5.5v37c0,3,2.5,5.5,5.5,5.5h53c3,0,5.5-2.5,5.5-5.5v-37C64,10.6,61.5,8.2,58.5,8.2L58.5,8.2z"/></svg>',
    },
    {
      label: "Quote",
      attributes: { class: "p-4 my-4 border-l-4 border-zinc-300 bg-slate-600 dark:border-slate-500 dark:bg-slate-800 italic rounded" },
      content: `<blockquote>Quote</blockquote>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="64px" height="64px" viewBox="0 0 64 64"><path d="M12,21.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,23.7,12,22.9,12,21.9z M12,31.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,33.7,12,32.9,12,31.9z M12,41.9c0-1,0.9-1.8,2-1.8h24c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,43.7,12,42.9,12,41.9z"/><path d="M58.5,11.2c1.4,0,2.5,1.1,2.5,2.5v37c0,1.4-1.1,2.5-2.5,2.5h-53C4.1,53.2,3,52,3,50.7v-37c0-1.4,1.1-2.5,2.5-2.5H58.5M58.5,8.2h-53c-3,0-5.5,2.5-5.5,5.5v37c0,3,2.5,5.5,5.5,5.5h53c3,0,5.5-2.5,5.5-5.5v-37C64,10.6,61.5,8.2,58.5,8.2L58.5,8.2z"/></svg>',
    },
    {
      label: "Video",
      content: `<iframe width="100%" height="400px" src="https://www.youtube.com/embed/AG0HC05sF90" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64"><path d="M27.3,22.6c-0.7-0.5-1.7-0.3-2.3,0.4c-0.2,0.3-0.3,0.6-0.3,0.9v16.2c0,0.9,0.7,1.6,1.6,1.6c0.3,0,0.7-0.1,0.9-0.3l11.3-8.1c0.7-0.5,0.9-1.5,0.4-2.3c-0.1-0.1-0.2-0.3-0.4-0.4C38.6,30.7,27.3,22.6,27.3,22.6z"/><path d="M6.1,19.1c0-3.6,2.9-6.5,6.5-6.5h38.8c3.6,0,6.5,2.9,6.5,6.5v25.9c0,3.6-2.9,6.5-6.5,6.5H12.6c-3.6,0-6.5-2.9-6.5-6.5V19.1zM54.6,19.1c0-1.8-1.4-3.2-3.2-3.2H12.6c-1.8,0-3.2,1.4-3.2,3.2v25.9c0,1.8,1.4,3.2,3.2,3.2h38.8c1.8,0,3.2-1.4,3.2-3.2V19.1z"/></svg>',
    },
    {
      label: "Form",
      attributes: { class: "container mx-auto" },
      content: `<div><div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          class="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" action="#" method="POST">
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6"
              >Email address</label
            >
            <div class="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 text-grey-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium leading-6"
                >Password</label
              >
              <div class="text-sm">
                <a
                  href="#"
                  class="font-semibold text-indigo-600 hover:text-indigo-500"
                  >Forgot password?</a
                >
              </div>
            </div>
            <div class="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset text-grey-600 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        <p class="mt-10 text-center text-sm text-gray-500">
          Not a member?<a
            href="#"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >Start a 14 day free trial</a>
        </p>
      </div></div>`,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="64px" height="64px" viewBox="0 0 64 64"><path d="M12,21.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,23.7,12,22.9,12,21.9z M12,31.9c0-1,0.9-1.8,2-1.8h36c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,33.7,12,32.9,12,31.9z M12,41.9c0-1,0.9-1.8,2-1.8h24c1.1,0,2,0.8,2,1.8s-0.9,1.8-2,1.8H14C12.9,43.7,12,42.9,12,41.9z"/><path d="M58.5,11.2c1.4,0,2.5,1.1,2.5,2.5v37c0,1.4-1.1,2.5-2.5,2.5h-53C4.1,53.2,3,52,3,50.7v-37c0-1.4,1.1-2.5,2.5-2.5H58.5M58.5,8.2h-53c-3,0-5.5,2.5-5.5,5.5v37c0,3,2.5,5.5,5.5,5.5h53c3,0,5.5-2.5,5.5-5.5v-37C64,10.6,61.5,8.2,58.5,8.2L58.5,8.2z"/></svg>',
    }
  ],
};



================================================
FILE: src/configs/tailwind.js
================================================
const colors = require("tailwindcss/colors");

export const screens = {
  sm: "640px",
  md: "768px",
  lg: "1280px",
  xl: "1536px",
};

export const combinedColors = {
  ...colors,
};

export const opacityValues = [
  "1",
  "0.9",
  "0.8",
  "0.7",
  "0.6",
  "0.5",
  "0.4",
  "0.3",
  "0.2",
  "0.1",
];

export const shadowLengthValues = [
  "-20px",
  "-10px",
  "-5px",
  "0px",
  "5px",
  "10px",
  "20px",
];

export const shadowBlurValues = ["0px", "5px", "10px", "20px"];

export const classes = {
  display: ["block", "flex", "grid", "inline-block", "inline", "hidden"],
  gridCols: [
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
    "grid-cols-9",
    "grid-cols-10",
    "grid-cols-11",
    "grid-cols-12",
    "grid-cols-none",
  ],
  width: [
    "w-0",
    "w-px",
    "w-0.5",
    "w-1",
    "w-1.5",
    "w-2",
    "w-2.5",
    "w-3",
    "w-3.5",
    "w-4",
    "w-5",
    "w-6",
    "w-7",
    "w-8",
    "w-9",
    "w-10",
    "w-11",
    "w-12",
    "w-14",
    "w-16",
    "w-20",
    "w-24",
    "w-28",
    "w-32",
    "w-36",
    "w-40",
    "w-44",
    "w-48",
    "w-52",
    "w-56",
    "w-60",
    "w-64",
    "w-72",
    "w-80",
    "w-96",
    "w-auto",
    "w-1/2",
    "w-1/3",
    "w-2/3",
    "w-1/4",
    "w-2/4",
    "w-3/4",
    "w-1/5",
    "w-2/5",
    "w-3/5",
    "w-4/5",
    "w-1/6",
    "w-2/6",
    "w-3/6",
    "w-4/6",
    "w-5/6",
    "w-1/12",
    "w-2/12",
    "w-3/12",
    "w-4/12",
    "w-5/12",
    "w-6/12",
    "w-7/12",
    "w-8/12",
    "w-9/12",
    "w-10/12",
    "w-11/12",
    "w-full",
    "w-screen",
    "w-min",
    "w-max",
    "w-fit",
  ],
  minWidth: ["min-w-0", "min-w-full", "min-w-min", "min-w-max", "min-w-fit"],
  maxWidth: [
    "max-w-0",
    "max-w-none",
    "max-w-xs",
    "max-w-sm",
    "max-w-md",
    "max-w-lg",
    "max-w-xl",
    "max-w-2xl",
    "max-w-3xl",
    "max-w-4xl",
    "max-w-5xl",
    "max-w-6xl",
    "max-w-7xl",
    "max-w-full",
    "max-w-min",
    "max-w-max",
    "max-w-fit",
    "max-w-prose",
    "max-w-screen-sm",
    "max-w-screen-md",
    "max-w-screen-lg",
    "max-w-screen-xl",
    "max-w-screen-2xl",
  ],
  height: [
    "h-0",
    "h-px",
    "h-0.5",
    "h-1",
    "h-1.5",
    "h-2",
    "h-2.5",
    "h-3",
    "h-3.5",
    "h-4",
    "h-5",
    "h-6",
    "h-7",
    "h-8",
    "h-9",
    "h-10",
    "h-11",
    "h-12",
    "h-14",
    "h-16",
    "h-20",
    "h-24",
    "h-28",
    "h-32",
    "h-36",
    "h-40",
    "h-44",
    "h-48",
    "h-52",
    "h-56",
    "h-60",
    "h-64",
    "h-72",
    "h-80",
    "h-96",
    "h-auto",
    "h-1/2",
    "h-1/3",
    "h-2/3",
    "h-1/4",
    "h-2/4",
    "h-3/4",
    "h-1/5",
    "h-2/5",
    "h-3/5",
    "h-4/5",
    "h-1/6",
    "h-2/6",
    "h-3/6",
    "h-4/6",
    "h-5/6",
    "h-full",
    "h-screen",
    "h-min",
    "h-max",
    "h-fit",
  ],
  maxHeight: [
    "min-h-0",
    "min-h-full",
    "min-h-screen",
    "min-h-min",
    "min-h-max",
    "min-h-fit",
  ],
  minHeight: [
    "max-h-0",
    "max-h-px",
    "max-h-0.5",
    "max-h-1",
    "max-h-1.5",
    "max-h-2",
    "max-h-2.5",
    "max-h-3",
    "max-h-3.5",
    "max-h-4",
    "max-h-5",
    "max-h-6",
    "max-h-7",
    "max-h-8",
    "max-h-9",
    "max-h-10",
    "max-h-11",
    "max-h-12",
    "max-h-14",
    "max-h-16",
    "max-h-20",
    "max-h-24",
    "max-h-28",
    "max-h-32",
    "max-h-36",
    "max-h-40",
    "max-h-44",
    "max-h-48",
    "max-h-52",
    "max-h-56",
    "max-h-60",
    "max-h-64",
    "max-h-72",
    "max-h-80",
    "max-h-96",
    "max-h-none",
    "max-h-full",
    "max-h-screen",
    "max-h-min",
    "max-h-max",
    "max-h-fit",
  ],
  position: ["static", "fixed", "absolute", "relative", "sticky"],
  zIndex: ["z-0", "z-10", "z-20", "z-30", "z-40", "z-50", "z-auto"],
  fontSize: [
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-4xl",
    "text-5xl",
    "text-6xl",
    "text-7x",
    "text-8xl",
    "text-9xl",
  ],
  fontWeight: [
    "font-thin",
    "font-extralight",
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
    "font-extrabold",
    "font-black",
  ],
  letterSpacing: [
    "tracking-tighter",
    "tracking-tight",
    "tracking-normal",
    "tracking-wide",
    "tracking-wider",
    "tracking-widest",
  ],
  lineHeight: [
    "leading-3",
    "leading-4",
    "leading-5",
    "leading-6",
    "leading-7",
    "leading-8",
    "leading-9",
    "leading-10",
    "leading-none",
    "leading-tight",
    "leading-snug",
    "leading-normal",
    "leading-relaxed",
    "leading-loose",
  ],
  textTransform: ["uppercase", "lowercase", "capitalize", "normal-case"],
  fontFamily: ["font-sans", "font-serif", "font-mono"],
  textColor: [
    "text-inherit",
    "text-current",
    "text-transparent",
    "text-black",
    "text-white",
    "text-slate-50",
    "text-slate-100",
    "text-slate-200",
    "text-slate-300",
    "text-slate-400",
    "text-slate-500",
    "text-slate-600",
    "text-slate-700",
    "text-slate-800",
    "text-slate-900",
    "text-slate-950",
    "text-gray-50",
    "text-gray-100",
    "text-gray-200",
    "text-gray-300",
    "text-gray-400",
    "text-gray-500",
    "text-gray-600",
    "text-gray-700",
    "text-gray-800",
    "text-gray-900",
    "text-gray-950",
    "text-zinc-50",
    "text-zinc-100",
    "text-zinc-200",
    "text-zinc-300",
    "text-zinc-400",
    "text-zinc-500",
    "text-zinc-600",
    "text-zinc-700",
    "text-zinc-800",
    "text-zinc-900",
    "text-zinc-950",
    "text-neutral-50",
    "text-neutral-100",
    "text-neutral-200",
    "text-neutral-300",
    "text-neutral-400",
    "text-neutral-500",
    "text-neutral-600",
    "text-neutral-700",
    "text-neutral-800",
    "text-neutral-900",
    "text-neutral-950",
    "text-stone-50",
    "text-stone-100",
    "text-stone-200",
    "text-stone-300",
    "text-stone-400",
    "text-stone-500",
    "text-stone-600",
    "text-stone-700",
    "text-stone-800",
    "text-stone-900",
    "text-stone-950",
    "text-red-50",
    "text-red-100",
    "text-red-200",
    "text-red-300",
    "text-red-400",
    "text-red-500",
    "text-red-600",
    "text-red-700",
    "text-red-800",
    "text-red-900",
    "text-red-950",
    "text-orange-50",
    "text-orange-100",
    "text-orange-200",
    "text-orange-300",
    "text-orange-400",
    "text-orange-500",
    "text-orange-600",
    "text-orange-700",
    "text-orange-800",
    "text-orange-900",
    "text-orange-950",
    "text-amber-50",
    "text-amber-100",
    "text-amber-200",
    "text-amber-300",
    "text-amber-400",
    "text-amber-500",
    "text-amber-600",
    "text-amber-700",
    "text-amber-800",
    "text-amber-900",
    "text-amber-950",
    "text-yellow-50",
    "text-yellow-100",
    "text-yellow-200",
    "text-yellow-300",
    "text-yellow-400",
    "text-yellow-500",
    "text-yellow-600",
    "text-yellow-700",
    "text-yellow-800",
    "text-yellow-900",
    "text-yellow-950",
    "text-lime-50",
    "text-lime-100",
    "text-lime-200",
    "text-lime-300",
    "text-lime-400",
    "text-lime-500",
    "text-lime-600",
    "text-lime-700",
    "text-lime-800",
    "text-lime-900",
    "text-lime-950",
    "text-green-50",
    "text-green-100",
    "text-green-200",
    "text-green-300",
    "text-green-400",
    "text-green-500",
    "text-green-600",
    "text-green-700",
    "text-green-800",
    "text-green-900",
    "text-green-950",
    "text-emerald-50",
    "text-emerald-100",
    "text-emerald-200",
    "text-emerald-300",
    "text-emerald-400",
    "text-emerald-500",
    "text-emerald-600",
    "text-emerald-700",
    "text-emerald-800",
    "text-emerald-900",
    "text-emerald-950",
    "text-teal-50",
    "text-teal-100",
    "text-teal-200",
    "text-teal-300",
    "text-teal-400",
    "text-teal-500",
    "text-teal-600",
    "text-teal-700",
    "text-teal-800",
    "text-teal-900",
    "text-teal-950",
    "text-cyan-50",
    "text-cyan-100",
    "text-cyan-200",
    "text-cyan-300",
    "text-cyan-400",
    "text-cyan-500",
    "text-cyan-600",
    "text-cyan-700",
    "text-cyan-800",
    "text-cyan-900",
    "text-cyan-950",
    "text-sky-50",
    "text-sky-100",
    "text-sky-200",
    "text-sky-300",
    "text-sky-400",
    "text-sky-500",
    "text-sky-600",
    "text-sky-700",
    "text-sky-800",
    "text-sky-900",
    "text-sky-950",
    "text-blue-50",
    "text-blue-100",
    "text-blue-200",
    "text-blue-300",
    "text-blue-400",
    "text-blue-500",
    "text-blue-600",
    "text-blue-700",
    "text-blue-800",
    "text-blue-900",
    "text-blue-950",
    "text-indigo-50",
    "text-indigo-100",
    "text-indigo-200",
    "text-indigo-300",
    "text-indigo-400",
    "text-indigo-500",
    "text-indigo-600",
    "text-indigo-700",
    "text-indigo-800",
    "text-indigo-900",
    "text-indigo-950",
    "text-violet-50",
    "text-violet-100",
    "text-violet-200",
    "text-violet-300",
    "text-violet-400",
    "text-violet-500",
    "text-violet-600",
    "text-violet-700",
    "text-violet-800",
    "text-violet-900",
    "text-violet-950",
    "text-purple-50",
    "text-purple-100",
    "text-purple-200",
    "text-purple-300",
    "text-purple-400",
    "text-purple-500",
    "text-purple-600",
    "text-purple-700",
    "text-purple-800",
    "text-purple-900",
    "text-purple-950",
    "text-fuchsia-50",
    "text-fuchsia-100",
    "text-fuchsia-200",
    "text-fuchsia-300",
    "text-fuchsia-400",
    "text-fuchsia-500",
    "text-fuchsia-600",
    "text-fuchsia-700",
    "text-fuchsia-800",
    "text-fuchsia-900",
    "text-fuchsia-950",
    "text-pink-50",
    "text-pink-100",
    "text-pink-200",
    "text-pink-300",
    "text-pink-400",
    "text-pink-500",
    "text-pink-600",
    "text-pink-700",
    "text-pink-800",
    "text-pink-900",
    "text-pink-950",
    "text-rose-50",
    "text-rose-100",
    "text-rose-200",
    "text-rose-300",
    "text-rose-400",
    "text-rose-500",
    "text-rose-600",
    "text-rose-700",
    "text-rose-800",
    "text-rose-900",
    "text-rose-950",
    "text-sky-50",
    "text-sky-100",
    "text-sky-200",
    "text-sky-300",
    "text-sky-400",
    "text-sky-500",
    "text-sky-600",
    "text-sky-700",
    "text-sky-800",
    "text-sky-900",
    "text-sky-950",
    "text-stone-50",
    "text-stone-100",
    "text-stone-200",
    "text-stone-300",
    "text-stone-400",
    "text-stone-500",
    "text-stone-600",
    "text-stone-700",
    "text-stone-800",
    "text-stone-900",
    "text-stone-950",
    "text-neutral-50",
    "text-neutral-100",
    "text-neutral-200",
    "text-neutral-300",
    "text-neutral-400",
    "text-neutral-500",
    "text-neutral-600",
    "text-neutral-700",
    "text-neutral-800",
    "text-neutral-900",
    "text-neutral-950",
    "text-gray-50",
    "text-gray-100",
    "text-gray-200",
    "text-gray-300",
    "text-gray-400",
    "text-gray-500",
    "text-gray-600",
    "text-gray-700",
    "text-gray-800",
    "text-gray-900",
    "text-gray-950",
    "text-slate-50",
    "text-slate-100",
    "text-slate-200",
    "text-slate-300",
    "text-slate-400",
    "text-slate-500",
    "text-slate-600",
    "text-slate-700",
    "text-slate-800",
    "text-slate-900",
    "text-slate-950",
  ],
  backgroundColor: [
    "bg-inherit",
    "bg-current",
    "bg-transparent",
    "bg-black",
    "bg-white",
    "bg-slate-50",
    "bg-slate-100",
    "bg-slate-200",
    "bg-slate-300",
    "bg-slate-400",
    "bg-slate-500",
    "bg-slate-600",
    "bg-slate-700",
    "bg-slate-800",
    "bg-slate-900",
    "bg-slate-950",
    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-600",
    "bg-gray-700",
    "bg-gray-800",
    "bg-gray-900",
    "bg-gray-950",
    "bg-zinc-50",
    "bg-zinc-100",
    "bg-zinc-200",
    "bg-zinc-300",
    "bg-zinc-400",
    "bg-zinc-500",
    "bg-zinc-600",
    "bg-zinc-700",
    "bg-zinc-800",
    "bg-zinc-900",
    "bg-zinc-950",
    "bg-neutral-50",
    "bg-neutral-100",
    "bg-neutral-200",
    "bg-neutral-300",
    "bg-neutral-400",
    "bg-neutral-500",
    "bg-neutral-600",
    "bg-neutral-700",
    "bg-neutral-800",
    "bg-neutral-900",
    "bg-neutral-950",
    "bg-stone-50",
    "bg-stone-100",
    "bg-stone-200",
    "bg-stone-300",
    "bg-stone-400",
    "bg-stone-500",
    "bg-stone-600",
    "bg-stone-700",
    "bg-stone-800",
    "bg-stone-900",
    "bg-stone-950",
    "bg-red-50",
    "bg-red-100",
    "bg-red-200",
    "bg-red-300",
    "bg-red-400",
    "bg-red-500",
    "bg-red-600",
    "bg-red-700",
    "bg-red-800",
    "bg-red-900",
    "bg-red-950",
    "bg-orange-50",
    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-orange-800",
    "bg-orange-900",
    "bg-orange-950",
    "bg-amber-50",
    "bg-amber-100",
    "bg-amber-200",
    "bg-amber-300",
    "bg-amber-400",
    "bg-amber-500",
    "bg-amber-600",
    "bg-amber-700",
    "bg-amber-800",
    "bg-amber-900",
    "bg-amber-950",
    "bg-yellow-50",
    "bg-yellow-100",
    "bg-yellow-200",
    "bg-yellow-300",
    "bg-yellow-400",
    "bg-yellow-500",
    "bg-yellow-600",
    "bg-yellow-700",
    "bg-yellow-800",
    "bg-yellow-900",
    "bg-yellow-950",
    "bg-lime-50",
    "bg-lime-100",
    "bg-lime-200",
    "bg-lime-300",
    "bg-lime-400",
    "bg-lime-500",
    "bg-lime-600",
    "bg-lime-700",
    "bg-lime-800",
    "bg-lime-900",
    "bg-lime-950",
    "bg-green-50",
    "bg-green-100",
    "bg-green-200",
    "bg-green-300",
    "bg-green-400",
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-green-800",
    "bg-green-900",
    "bg-green-950",
    "bg-emerald-50",
    "bg-emerald-100",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-emerald-400",
    "bg-emerald-500",
    "bg-emerald-600",
    "bg-emerald-700",
    "bg-emerald-800",
    "bg-emerald-900",
    "bg-emerald-950",
    "bg-teal-50",
    "bg-teal-100",
    "bg-teal-200",
    "bg-teal-300",
    "bg-teal-400",
    "bg-teal-500",
    "bg-teal-600",
    "bg-teal-700",
    "bg-teal-800",
    "bg-teal-900",
    "bg-teal-950",
    "bg-cyan-50",
    "bg-cyan-100",
    "bg-cyan-200",
    "bg-cyan-300",
    "bg-cyan-400",
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-cyan-700",
    "bg-cyan-800",
    "bg-cyan-900",
    "bg-cyan-950",
    "bg-sky-50",
    "bg-sky-100",
    "bg-sky-200",
    "bg-sky-300",
    "bg-sky-400",
    "bg-sky-500",
    "bg-sky-600",
    "bg-sky-700",
    "bg-sky-800",
    "bg-sky-900",
    "bg-sky-950",
    "bg-blue-50",
    "bg-blue-100",
    "bg-blue-200",
    "bg-blue-300",
    "bg-blue-400",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "bg-blue-800",
    "bg-blue-900",
    "bg-blue-950",
    "bg-indigo-50",
    "bg-indigo-100",
    "bg-indigo-200",
    "bg-indigo-300",
    "bg-indigo-400",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-indigo-700",
    "bg-indigo-800",
    "bg-indigo-900",
    "bg-indigo-950",
    "bg-violet-50",
    "bg-violet-100",
    "bg-violet-200",
    "bg-violet-300",
    "bg-violet-400",
    "bg-violet-500",
    "bg-violet-600",
    "bg-violet-700",
    "bg-violet-800",
    "bg-violet-900",
    "bg-violet-950",
    "bg-purple-50",
    "bg-purple-100",
    "bg-purple-200",
    "bg-purple-300",
    "bg-purple-400",
    "bg-purple-500",
    "bg-purple-600",
    "bg-purple-700",
    "bg-purple-800",
    "bg-purple-900",
    "bg-purple-950",
    "bg-fuchsia-50",
    "bg-fuchsia-100",
    "bg-fuchsia-200",
    "bg-fuchsia-300",
    "bg-fuchsia-400",
    "bg-fuchsia-500",
    "bg-fuchsia-600",
    "bg-fuchsia-700",
    "bg-fuchsia-800",
    "bg-fuchsia-900",
    "bg-fuchsia-950",
    "bg-pink-50",
    "bg-pink-100",
    "bg-pink-200",
    "bg-pink-300",
    "bg-pink-400",
    "bg-pink-500",
    "bg-pink-600",
    "bg-pink-700",
    "bg-pink-800",
    "bg-pink-900",
    "bg-pink-950",
    "bg-rose-50",
    "bg-rose-100",
    "bg-rose-200",
    "bg-rose-300",
    "bg-rose-400",
    "bg-rose-500",
    "bg-rose-600",
    "bg-rose-700",
    "bg-rose-800",
    "bg-rose-900",
    "bg-rose-950",
    "bg-sky-50",
    "bg-sky-100",
    "bg-sky-200",
    "bg-sky-300",
    "bg-sky-400",
    "bg-sky-500",
    "bg-sky-600",
    "bg-sky-700",
    "bg-sky-800",
    "bg-sky-900",
    "bg-sky-950",
    "bg-stone-50",
    "bg-stone-100",
    "bg-stone-200",
    "bg-stone-300",
    "bg-stone-400",
    "bg-stone-500",
    "bg-stone-600",
    "bg-stone-700",
    "bg-stone-800",
    "bg-stone-900",
    "bg-stone-950",
    "bg-neutral-50",
    "bg-neutral-100",
    "bg-neutral-200",
    "bg-neutral-300",
    "bg-neutral-400",
    "bg-neutral-500",
    "bg-neutral-600",
    "bg-neutral-700",
    "bg-neutral-800",
    "bg-neutral-900",
    "bg-neutral-950",
    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-600",
    "bg-gray-700",
    "bg-gray-800",
    "bg-gray-900",
    "bg-gray-950",
    "bg-slate-50",
    "bg-slate-100",
    "bg-slate-200",
    "bg-slate-300",
    "bg-slate-400",
    "bg-slate-500",
    "bg-slate-600",
    "bg-slate-700",
    "bg-slate-800",
    "bg-slate-900",
    "bg-slate-950",
  ],
  opacity: [
    "opacity-0",
    "opacity-5",
    "opacity-10",
    "opacity-20",
    "opacity-25",
    "opacity-30",
    "opacity-40",
    "opacity-50",
    "opacity-60",
    "opacity-70",
    "opacity-75",
    "opacity-80",
    "opacity-90",
    "opacity-95",
    "opacity-100",
  ],
  backgroundBlendMode: [
    "bg-blend-normal",
    "bg-blend-multiply",
    "bg-blend-screen",
    "bg-blend-overlay",
    "bg-blend-darken",
    "bg-blend-lighten",
    "bg-blend-color-dodge",
    "bg-blend-color-burn",
    "bg-blend-hard-light",
    "bg-blend-soft-light",
    "bg-blend-difference",
    "bg-blend-exclusion",
    "bg-blend-hue",
    "bg-blend-saturation",
    "bg-blend-color",
    "bg-blend-luminosity",
  ],
  cursor: [
    "cursor-auto",
    "cursor-default",
    "cursor-pointer",
    "cursor-wait",
    "cursor-text",
    "cursor-move",
    "cursor-help",
    "cursor-not-allowed",
    "cursor-none",
    "cursor-context-menu",
    "cursor-progress",
    "cursor-cell",
    "cursor-crosshair",
    "cursor-vertical-text",
    "cursor-alias",
    "cursor-copy",
    "cursor-no-drop",
    "cursor-grab",
    "cursor-grabbing",
    "cursor-all-scroll",
    "cursor-col-resize",
    "cursor-row-resize",
    "cursor-n-resize",
    "cursor-e-resize",
    "cursor-s-resize",
    "cursor-w-resize",
    "cursor-ne-resize",
    "cursor-nw-resize",
    "cursor-se-resize",
    "cursor-sw-resize",
    "cursor-ew-resize",
    "cursor-ns-resize",
    "cursor-nesw-resize",
    "cursor-nwse-resize",
    "cursor-zoom-in",
    "cursor-zoom-out",
  ],
  blur: [
    "blur-none",
    "blur-sm",
    "blur",
    "blur-md",
    "blur-lg",
    "blur-xl",
    "blur-2xl",
    "blur-3xl",
  ],
  boxShadow: [
    "shadow-sm",
    "shadow",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
    "shadow-inner",
    "shadow-none",
  ],
  textAlign: [
    "text-left",
    "text-center",
    "text-right",
    "text-justify",
    "text-start",
    "text-end",
  ],
  spacing: [
    "0",
    "px",
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "20",
    "24",
    "28",
    "32",
    "36",
    "40",
    "44",
    "48",
    "52",
    "56",
    "60",
    "64",
    "72",
    "80",
    "96",
  ],
  margin: [
    "m-0",
    "m-px",
    "m-0.5",
    "m-1",
    "m-1.5",
    "m-2",
    "m-2.5",
    "m-3",
    "m-3.5",
    "m-4",
    "m-5",
    "m-6",
    "m-7",
    "m-8",
    "m-9",
    "m-10",
    "m-11",
    "m-12",
    "m-14",
    "m-16",
    "m-20",
    "m-24",
    "m-28",
    "m-32",
    "m-36",
    "m-40",
    "m-44",
    "m-48",
    "m-52",
    "m-56",
    "m-60",
    "m-64",
    "m-72",
    "m-80",
    "m-96",
  ],
  marginTop: [
    "mt-0",
    "mt-px",
    "mt-0.5",
    "mt-1",
    "mt-1.5",
    "mt-2",
    "mt-2.5",
    "mt-3",
    "mt-3.5",
    "mt-4",
    "mt-5",
    "mt-6",
    "mt-7",
    "mt-8",
    "mt-9",
    "mt-10",
    "mt-11",
    "mt-12",
    "mt-14",
    "mt-16",
    "mt-20",
    "mt-24",
    "mt-28",
    "mt-32",
    "mt-36",
    "mt-40",
    "mt-44",
    "mt-48",
    "mt-52",
    "mt-56",
    "mt-60",
    "mt-64",
    "mt-72",
    "mt-80",
    "mt-96",
  ],
  marginLeft: [
    "ml-0",
    "ml-px",
    "ml-0.5",
    "ml-1",
    "ml-1.5",
    "ml-2",
    "ml-2.5",
    "ml-3",
    "ml-3.5",
    "ml-4",
    "ml-5",
    "ml-6",
    "ml-7",
    "ml-8",
    "ml-9",
    "ml-10",
    "ml-11",
    "ml-12",
    "ml-14",
    "ml-16",
    "ml-20",
    "ml-24",
    "ml-28",
    "ml-32",
    "ml-36",
    "ml-40",
    "ml-44",
    "ml-48",
    "ml-52",
    "ml-56",
    "ml-60",
    "ml-64",
    "ml-72",
    "ml-80",
    "ml-96",
  ],
  marginRight: [
    "mr-0",
    "mr-px",
    "mr-0.5",
    "mr-1",
    "mr-1.5",
    "mr-2",
    "mr-2.5",
    "mr-3",
    "mr-3.5",
    "mr-4",
    "mr-5",
    "mr-6",
    "mr-7",
    "mr-8",
    "mr-9",
    "mr-10",
    "mr-11",
    "mr-12",
    "mr-14",
    "mr-16",
    "mr-20",
    "mr-24",
    "mr-28",
    "mr-32",
    "mr-36",
    "mr-40",
    "mr-44",
    "mr-48",
    "mr-52",
    "mr-56",
    "mr-60",
    "mr-64",
    "mr-72",
    "mr-80",
    "mr-96",
  ],
  marginBottom: [
    "mb-0",
    "mb-px",
    "mb-0.5",
    "mb-1",
    "mb-1.5",
    "mb-2",
    "mb-2.5",
    "mb-3",
    "mb-3.5",
    "mb-4",
    "mb-5",
    "mb-6",
    "mb-7",
    "mb-8",
    "mb-9",
    "mb-10",
    "mb-11",
    "mb-12",
    "mb-14",
    "mb-16",
    "mb-20",
    "mb-24",
    "mb-28",
    "mb-32",
    "mb-36",
    "mb-40",
    "mb-44",
    "mb-48",
    "mb-52",
    "mb-56",
    "mb-60",
    "mb-64",
    "mb-72",
    "mb-80",
    "mb-96",
  ],
  marginX: [
    "mx-auto",
    "mx-0",
    "mx-px",
    "mx-0.5",
    "mx-1",
    "mx-1.5",
    "mx-2",
    "mx-2.5",
    "mx-3",
    "mx-3.5",
    "mx-4",
    "mx-5",
    "mx-6",
    "mx-7",
    "mx-8",
    "mx-9",
    "mx-10",
    "mx-11",
    "mx-12",
    "mx-14",
    "mx-16",
    "mx-20",
    "mx-24",
    "mx-28",
    "mx-32",
    "mx-36",
    "mx-40",
    "mx-44",
    "mx-48",
    "mx-52",
    "mx-56",
    "mx-60",
    "mx-64",
    "mx-72",
    "mx-80",
    "mx-96",
  ],
  marginY: [
    "my-auto",
    "my-0",
    "my-px",
    "my-0.5",
    "my-1",
    "my-1.5",
    "my-2",
    "my-2.5",
    "my-3",
    "my-3.5",
    "my-4",
    "my-5",
    "my-6",
    "my-7",
    "my-8",
    "my-9",
    "my-10",
    "my-11",
    "my-12",
    "my-14",
    "my-16",
    "my-20",
    "my-24",
    "my-28",
    "my-32",
    "my-36",
    "my-40",
    "my-44",
    "my-48",
    "my-52",
    "my-56",
    "my-60",
    "my-64",
    "my-72",
    "my-80",
    "my-96",
  ],
  padding: [
    "p-0",
    "p-px",
    "p-0.5",
    "p-1",
    "p-1.5",
    "p-2",
    "p-2.5",
    "p-3",
    "p-3.5",
    "p-4",
    "p-5",
    "p-6",
    "p-7",
    "p-8",
    "p-9",
    "p-10",
    "p-11",
    "p-12",
    "p-14",
    "p-16",
    "p-20",
    "p-24",
    "p-28",
    "p-32",
    "p-36",
    "p-40",
    "p-44",
    "p-48",
    "p-52",
    "p-56",
    "p-60",
    "p-64",
    "p-72",
    "p-80",
    "p-96",
  ],
  paddingY: [
    "py-0",
    "py-px",
    "py-0.5",
    "py-1",
    "py-1.5",
    "py-2",
    "py-2.5",
    "py-3",
    "py-3.5",
    "py-4",
    "py-5",
    "py-6",
    "py-7",
    "py-8",
    "py-9",
    "py-10",
    "py-11",
    "py-12",
    "py-14",
    "py-16",
    "py-20",
    "py-24",
    "py-28",
    "py-32",
    "py-36",
    "py-40",
    "py-44",
    "py-48",
    "py-52",
    "py-56",
    "py-60",
    "py-64",
    "py-72",
    "py-80",
    "py-96",
  ],
  paddingX: [
    "px-0",
    "px-px",
    "px-0.5",
    "px-1",
    "px-1.5",
    "px-2",
    "px-2.5",
    "px-3",
    "px-3.5",
    "px-4",
    "px-5",
    "px-6",
    "px-7",
    "px-8",
    "px-9",
    "px-10",
    "px-11",
    "px-12",
    "px-14",
    "px-16",
    "px-20",
    "px-24",
    "px-28",
    "px-32",
    "px-36",
    "px-40",
    "px-44",
    "px-48",
    "px-52",
    "px-56",
    "px-60",
    "px-64",
    "px-72",
    "px-80",
    "px-96",
  ],
  paddingTop: [
    "pt-0",
    "pt-px",
    "pt-0.5",
    "pt-1",
    "pt-1.5",
    "pt-2",
    "pt-2.5",
    "pt-3",
    "pt-3.5",
    "pt-4",
    "pt-5",
    "pt-6",
    "pt-7",
    "pt-8",
    "pt-9",
    "pt-10",
    "pt-11",
    "pt-12",
    "pt-14",
    "pt-16",
    "pt-20",
    "pt-24",
    "pt-28",
    "pt-32",
    "pt-36",
    "pt-40",
    "pt-44",
    "pt-48",
    "pt-52",
    "pt-56",
    "pt-60",
    "pt-64",
    "pt-72",
    "pt-80",
    "pt-96",
  ],
  paddingLeft: [
    "pl-0",
    "pl-px",
    "pl-0.5",
    "pl-1",
    "pl-1.5",
    "pl-2",
    "pl-2.5",
    "pl-3",
    "pl-3.5",
    "pl-4",
    "pl-5",
    "pl-6",
    "pl-7",
    "pl-8",
    "pl-9",
    "pl-10",
    "pl-11",
    "pl-12",
    "pl-14",
    "pl-16",
    "pl-20",
    "pl-24",
    "pl-28",
    "pl-32",
    "pl-36",
    "pl-40",
    "pl-44",
    "pl-48",
    "pl-52",
    "pl-56",
    "pl-60",
    "pl-64",
    "pl-72",
    "pl-80",
    "pl-96",
  ],
  paddingRight: [
    "pr-0",
    "pr-px",
    "pr-0.5",
    "pr-1",
    "pr-1.5",
    "pr-2",
    "pr-2.5",
    "pr-3",
    "pr-3.5",
    "pr-4",
    "pr-5",
    "pr-6",
    "pr-7",
    "pr-8",
    "pr-9",
    "pr-10",
    "pr-11",
    "pr-12",
    "pr-14",
    "pr-16",
    "pr-20",
    "pr-24",
    "pr-28",
    "pr-32",
    "pr-36",
    "pr-40",
    "pr-44",
    "pr-48",
    "pr-52",
    "pr-56",
    "pr-60",
    "pr-64",
    "pr-72",
    "pr-80",
    "pr-96",
  ],
  paddingBottom: [
    "pb-0",
    "pb-px",
    "pb-0.5",
    "pb-1",
    "pb-1.5",
    "pb-2",
    "pb-2.5",
    "pb-3",
    "pb-3.5",
    "pb-4",
    "pb-5",
    "pb-6",
    "pb-7",
    "pb-8",
    "pb-9",
    "pb-10",
    "pb-11",
    "pb-12",
    "pb-14",
    "pb-16",
    "pb-20",
    "pb-24",
    "pb-28",
    "pb-32",
    "pb-36",
    "pb-40",
    "pb-44",
    "pb-48",
    "pb-52",
    "pb-56",
    "pb-60",
    "pb-64",
    "pb-72",
    "pb-80",
    "pb-96",
  ],
  borderStyle: [
    "border-solid",
    "border-dashed",
    "border-dotted",
    "border-double",
    "border-hidden",
    "border-none",
  ],
  borderColor: [
    "border-inherit",
    "border-current",
    "border-transparent",
    "border-black",
    "border-white",
    "border-slate-50",
    "border-slate-100",
    "border-slate-200",
    "border-slate-300",
    "border-slate-400",
    "border-slate-500",
    "border-slate-600",
    "border-slate-700",
    "border-slate-800",
    "border-slate-900",
    "border-slate-950",
    "border-gray-50",
    "border-gray-100",
    "border-gray-200",
    "border-gray-300",
    "border-gray-400",
    "border-gray-500",
    "border-gray-600",
    "border-gray-700",
    "border-gray-800",
    "border-gray-900",
    "border-gray-950",
    "border-zinc-50",
    "border-zinc-100",
    "border-zinc-200",
    "border-zinc-300",
    "border-zinc-400",
    "border-zinc-500",
    "border-zinc-600",
    "border-zinc-700",
    "border-zinc-800",
    "border-zinc-900",
    "border-zinc-950",
    "border-neutral-50",
    "border-neutral-100",
    "border-neutral-200",
    "border-neutral-300",
    "border-neutral-400",
    "border-neutral-500",
    "border-neutral-600",
    "border-neutral-700",
    "border-neutral-800",
    "border-neutral-900",
    "border-neutral-950",
    "border-stone-50",
    "border-stone-100",
    "border-stone-200",
    "border-stone-300",
    "border-stone-400",
    "border-stone-500",
    "border-stone-600",
    "border-stone-700",
    "border-stone-800",
    "border-stone-900",
    "border-stone-950",
    "border-red-50",
    "border-red-100",
    "border-red-200",
    "border-red-300",
    "border-red-400",
    "border-red-500",
    "border-red-600",
    "border-red-700",
    "border-red-800",
    "border-red-900",
    "border-red-950",
    "border-orange-50",
    "border-orange-100",
    "border-orange-200",
    "border-orange-300",
    "border-orange-400",
    "border-orange-500",
    "border-orange-600",
    "border-orange-700",
    "border-orange-800",
    "border-orange-900",
    "border-orange-950",
    "border-amber-50",
    "border-amber-100",
    "border-amber-200",
    "border-amber-300",
    "border-amber-400",
    "border-amber-500",
    "border-amber-600",
    "border-amber-700",
    "border-amber-800",
    "border-amber-900",
    "border-amber-950",
    "border-yellow-50",
    "border-yellow-100",
    "border-yellow-200",
    "border-yellow-300",
    "border-yellow-400",
    "border-yellow-500",
    "border-yellow-600",
    "border-yellow-700",
    "border-yellow-800",
    "border-yellow-900",
    "border-yellow-950",
    "border-lime-50",
    "border-lime-100",
    "border-lime-200",
    "border-lime-300",
    "border-lime-400",
    "border-lime-500",
    "border-lime-600",
    "border-lime-700",
    "border-lime-800",
    "border-lime-900",
    "border-lime-950",
    "border-green-50",
    "border-green-100",
    "border-green-200",
    "border-green-300",
    "border-green-400",
    "border-green-500",
    "border-green-600",
    "border-green-700",
    "border-green-800",
    "border-green-900",
    "border-green-950",
    "border-emerald-50",
    "border-emerald-100",
    "border-emerald-200",
    "border-emerald-300",
    "border-emerald-400",
    "border-emerald-500",
    "border-emerald-600",
    "border-emerald-700",
    "border-emerald-800",
    "border-emerald-900",
    "border-emerald-950",
    "border-teal-50",
    "border-teal-100",
    "border-teal-200",
    "border-teal-300",
    "border-teal-400",
    "border-teal-500",
    "border-teal-600",
    "border-teal-700",
    "border-teal-800",
    "border-teal-900",
    "border-teal-950",
    "border-cyan-50",
    "border-cyan-100",
    "border-cyan-200",
    "border-cyan-300",
    "border-cyan-400",
    "border-cyan-500",
    "border-cyan-600",
    "border-cyan-700",
    "border-cyan-800",
    "border-cyan-900",
    "border-cyan-950",
    "border-sky-50",
    "border-sky-100",
    "border-sky-200",
    "border-sky-300",
    "border-sky-400",
    "border-sky-500",
    "border-sky-600",
    "border-sky-700",
    "border-sky-800",
    "border-sky-900",
    "border-sky-950",
    "border-blue-50",
    "border-blue-100",
    "border-blue-200",
    "border-blue-300",
    "border-blue-400",
    "border-blue-500",
    "border-blue-600",
    "border-blue-700",
    "border-blue-800",
    "border-blue-900",
    "border-blue-950",
    "border-indigo-50",
    "border-indigo-100",
    "border-indigo-200",
    "border-indigo-300",
    "border-indigo-400",
    "border-indigo-500",
    "border-indigo-600",
    "border-indigo-700",
    "border-indigo-800",
    "border-indigo-900",
    "border-indigo-950",
    "border-violet-50",
    "border-violet-100",
    "border-violet-200",
    "border-violet-300",
    "border-violet-400",
    "border-violet-500",
    "border-violet-600",
    "border-violet-700",
    "border-violet-800",
    "border-violet-900",
    "border-violet-950",
    "border-purple-50",
    "border-purple-100",
    "border-purple-200",
    "border-purple-300",
    "border-purple-400",
    "border-purple-500",
    "border-purple-600",
    "border-purple-700",
    "border-purple-800",
    "border-purple-900",
    "border-purple-950",
    "border-fuchsia-50",
    "border-fuchsia-100",
    "border-fuchsia-200",
    "border-fuchsia-300",
    "border-fuchsia-400",
    "border-fuchsia-500",
    "border-fuchsia-600",
    "border-fuchsia-700",
    "border-fuchsia-800",
    "border-fuchsia-900",
    "border-fuchsia-950",
    "border-pink-50",
    "border-pink-100",
    "border-pink-200",
    "border-pink-300",
    "border-pink-400",
    "border-pink-500",
    "border-pink-600",
    "border-pink-700",
    "border-pink-800",
    "border-pink-900",
    "border-pink-950",
    "border-rose-50",
    "border-rose-100",
    "border-rose-200",
    "border-rose-300",
    "border-rose-400",
    "border-rose-500",
    "border-rose-600",
    "border-rose-700",
    "border-rose-800",
    "border-rose-900",
    "border-rose-950",
    "border-sky-50",
    "border-sky-100",
    "border-sky-200",
    "border-sky-300",
    "border-sky-400",
    "border-sky-500",
    "border-sky-600",
    "border-sky-700",
    "border-sky-800",
    "border-sky-900",
    "border-sky-950",
    "border-stone-50",
    "border-stone-100",
    "border-stone-200",
    "border-stone-300",
    "border-stone-400",
    "border-stone-500",
    "border-stone-600",
    "border-stone-700",
    "border-stone-800",
    "border-stone-900",
    "border-stone-950",
    "border-neutral-50",
    "border-neutral-100",
    "border-neutral-200",
    "border-neutral-300",
    "border-neutral-400",
    "border-neutral-500",
    "border-neutral-600",
    "border-neutral-700",
    "border-neutral-800",
    "border-neutral-900",
    "border-neutral-950",
    "border-gray-50",
    "border-gray-100",
    "border-gray-200",
    "border-gray-300",
    "border-gray-400",
    "border-gray-500",
    "border-gray-600",
    "border-gray-700",
    "border-gray-800",
    "border-gray-900",
    "border-gray-950",
    "border-slate-50",
    "border-slate-100",
    "border-slate-200",
    "border-slate-300",
    "border-slate-400",
    "border-slate-500",
    "border-slate-600",
    "border-slate-700",
    "border-slate-800",
    "border-slate-900",
    "border-slate-950",
  ],
  borderXColor: [
    "border-x-inherit",
    "border-x-current",
    "border-x-transparent",
    "border-x-black",
    "border-x-white",
    "border-x-slate-50",
    "border-x-slate-100",
    "border-x-slate-200",
    "border-x-slate-300",
    "border-x-slate-400",
    "border-x-slate-500",
    "border-x-slate-600",
    "border-x-slate-700",
    "border-x-slate-800",
    "border-x-slate-900",
    "border-x-slate-950",
    "border-x-gray-50",
    "border-x-gray-100",
    "border-x-gray-200",
    "border-x-gray-300",
    "border-x-gray-400",
    "border-x-gray-500",
    "border-x-gray-600",
    "border-x-gray-700",
    "border-x-gray-800",
    "border-x-gray-900",
    "border-x-gray-950",
    "border-x-zinc-50",
    "border-x-zinc-100",
    "border-x-zinc-200",
    "border-x-zinc-300",
    "border-x-zinc-400",
    "border-x-zinc-500",
    "border-x-zinc-600",
    "border-x-zinc-700",
    "border-x-zinc-800",
    "border-x-zinc-900",
    "border-x-zinc-950",
    "border-x-neutral-50",
    "border-x-neutral-100",
    "border-x-neutral-200",
    "border-x-neutral-300",
    "border-x-neutral-400",
    "border-x-neutral-500",
    "border-x-neutral-600",
    "border-x-neutral-700",
    "border-x-neutral-800",
    "border-x-neutral-900",
    "border-x-neutral-950",
    "border-x-stone-50",
    "border-x-stone-100",
    "border-x-stone-200",
    "border-x-stone-300",
    "border-x-stone-400",
    "border-x-stone-500",
    "border-x-stone-600",
    "border-x-stone-700",
    "border-x-stone-800",
    "border-x-stone-900",
    "border-x-stone-950",
    "border-x-red-50",
    "border-x-red-100",
    "border-x-red-200",
    "border-x-red-300",
    "border-x-red-400",
    "border-x-red-500",
    "border-x-red-600",
    "border-x-red-700",
    "border-x-red-800",
    "border-x-red-900",
    "border-x-red-950",
    "border-x-orange-50",
    "border-x-orange-100",
    "border-x-orange-200",
    "border-x-orange-300",
    "border-x-orange-400",
    "border-x-orange-500",
    "border-x-orange-600",
    "border-x-orange-700",
    "border-x-orange-800",
    "border-x-orange-900",
    "border-x-orange-950",
    "border-x-amber-50",
    "border-x-amber-100",
    "border-x-amber-200",
    "border-x-amber-300",
    "border-x-amber-400",
    "border-x-amber-500",
    "border-x-amber-600",
    "border-x-amber-700",
    "border-x-amber-800",
    "border-x-amber-900",
    "border-x-amber-950",
    "border-x-yellow-50",
    "border-x-yellow-100",
    "border-x-yellow-200",
    "border-x-yellow-300",
    "border-x-yellow-400",
    "border-x-yellow-500",
    "border-x-yellow-600",
    "border-x-yellow-700",
    "border-x-yellow-800",
    "border-x-yellow-900",
    "border-x-yellow-950",
    "border-x-lime-50",
    "border-x-lime-100",
    "border-x-lime-200",
    "border-x-lime-300",
    "border-x-lime-400",
    "border-x-lime-500",
    "border-x-lime-600",
    "border-x-lime-700",
    "border-x-lime-800",
    "border-x-lime-900",
    "border-x-lime-950",
    "border-x-green-50",
    "border-x-green-100",
    "border-x-green-200",
    "border-x-green-300",
    "border-x-green-400",
    "border-x-green-500",
    "border-x-green-600",
    "border-x-green-700",
    "border-x-green-800",
    "border-x-green-900",
    "border-x-green-950",
    "border-x-emerald-50",
    "border-x-emerald-100",
    "border-x-emerald-200",
    "border-x-emerald-300",
    "border-x-emerald-400",
    "border-x-emerald-500",
    "border-x-emerald-600",
    "border-x-emerald-700",
    "border-x-emerald-800",
    "border-x-emerald-900",
    "border-x-emerald-950",
    "border-x-teal-50",
    "border-x-teal-100",
    "border-x-teal-200",
    "border-x-teal-300",
    "border-x-teal-400",
    "border-x-teal-500",
    "border-x-teal-600",
    "border-x-teal-700",
    "border-x-teal-800",
    "border-x-teal-900",
    "border-x-teal-950",
    "border-x-cyan-50",
    "border-x-cyan-100",
    "border-x-cyan-200",
    "border-x-cyan-300",
    "border-x-cyan-400",
    "border-x-cyan-500",
    "border-x-cyan-600",
    "border-x-cyan-700",
    "border-x-cyan-800",
    "border-x-cyan-900",
    "border-x-cyan-950",
    "border-x-sky-50",
    "border-x-sky-100",
    "border-x-sky-200",
    "border-x-sky-300",
    "border-x-sky-400",
    "border-x-sky-500",
    "border-x-sky-600",
    "border-x-sky-700",
    "border-x-sky-800",
    "border-x-sky-900",
    "border-x-sky-950",
    "border-x-blue-50",
    "border-x-blue-100",
    "border-x-blue-200",
    "border-x-blue-300",
    "border-x-blue-400",
    "border-x-blue-500",
    "border-x-blue-600",
    "border-x-blue-700",
    "border-x-blue-800",
    "border-x-blue-900",
    "border-x-blue-950",
    "border-x-indigo-50",
    "border-x-indigo-100",
    "border-x-indigo-200",
    "border-x-indigo-300",
    "border-x-indigo-400",
    "border-x-indigo-500",
    "border-x-indigo-600",
    "border-x-indigo-700",
    "border-x-indigo-800",
    "border-x-indigo-900",
    "border-x-indigo-950",
    "border-x-violet-50",
    "border-x-violet-100",
    "border-x-violet-200",
    "border-x-violet-300",
    "border-x-violet-400",
    "border-x-violet-500",
    "border-x-violet-600",
    "border-x-violet-700",
    "border-x-violet-800",
    "border-x-violet-900",
    "border-x-violet-950",
    "border-x-purple-50",
    "border-x-purple-100",
    "border-x-purple-200",
    "border-x-purple-300",
    "border-x-purple-400",
    "border-x-purple-500",
    "border-x-purple-600",
    "border-x-purple-700",
    "border-x-purple-800",
    "border-x-purple-900",
    "border-x-purple-950",
    "border-x-fuchsia-50",
    "border-x-fuchsia-100",
    "border-x-fuchsia-200",
    "border-x-fuchsia-300",
    "border-x-fuchsia-400",
    "border-x-fuchsia-500",
    "border-x-fuchsia-600",
    "border-x-fuchsia-700",
    "border-x-fuchsia-800",
    "border-x-fuchsia-900",
    "border-x-fuchsia-950",
    "border-x-pink-50",
    "border-x-pink-100",
    "border-x-pink-200",
    "border-x-pink-300",
    "border-x-pink-400",
    "border-x-pink-500",
    "border-x-pink-600",
    "border-x-pink-700",
    "border-x-pink-800",
    "border-x-pink-900",
    "border-x-pink-950",
    "border-x-rose-50",
    "border-x-rose-100",
    "border-x-rose-200",
    "border-x-rose-300",
    "border-x-rose-400",
    "border-x-rose-500",
    "border-x-rose-600",
    "border-x-rose-700",
    "border-x-rose-800",
    "border-x-rose-900",
    "border-x-rose-950",
    "border-x-sky-50",
    "border-x-sky-100",
    "border-x-sky-200",
    "border-x-sky-300",
    "border-x-sky-400",
    "border-x-sky-500",
    "border-x-sky-600",
    "border-x-sky-700",
    "border-x-sky-800",
    "border-x-sky-900",
    "border-x-sky-950",
    "border-x-stone-50",
    "border-x-stone-100",
    "border-x-stone-200",
    "border-x-stone-300",
    "border-x-stone-400",
    "border-x-stone-500",
    "border-x-stone-600",
    "border-x-stone-700",
    "border-x-stone-800",
    "border-x-stone-900",
    "border-x-stone-950",
    "border-x-neutral-50",
    "border-x-neutral-100",
    "border-x-neutral-200",
    "border-x-neutral-300",
    "border-x-neutral-400",
    "border-x-neutral-500",
    "border-x-neutral-600",
    "border-x-neutral-700",
    "border-x-neutral-800",
    "border-x-neutral-900",
    "border-x-neutral-950",
    "border-x-gray-50",
    "border-x-gray-100",
    "border-x-gray-200",
    "border-x-gray-300",
    "border-x-gray-400",
    "border-x-gray-500",
    "border-x-gray-600",
    "border-x-gray-700",
    "border-x-gray-800",
    "border-x-gray-900",
    "border-x-gray-950",
    "border-x-slate-50",
    "border-x-slate-100",
    "border-x-slate-200",
    "border-x-slate-300",
    "border-x-slate-400",
    "border-x-slate-500",
    "border-x-slate-600",
    "border-x-slate-700",
    "border-x-slate-800",
    "border-x-slate-900",
    "border-x-slate-950",
  ],
  borderYColor: [
    "border-y-inherit",
    "border-y-current",
    "border-y-transparent",
    "border-y-black",
    "border-y-white",
    "border-y-slate-50",
    "border-y-slate-100",
    "border-y-slate-200",
    "border-y-slate-300",
    "border-y-slate-400",
    "border-y-slate-500",
    "border-y-slate-600",
    "border-y-slate-700",
    "border-y-slate-800",
    "border-y-slate-900",
    "border-y-slate-950",
    "border-y-gray-50",
    "border-y-gray-100",
    "border-y-gray-200",
    "border-y-gray-300",
    "border-y-gray-400",
    "border-y-gray-500",
    "border-y-gray-600",
    "border-y-gray-700",
    "border-y-gray-800",
    "border-y-gray-900",
    "border-y-gray-950",
    "border-y-zinc-50",
    "border-y-zinc-100",
    "border-y-zinc-200",
    "border-y-zinc-300",
    "border-y-zinc-400",
    "border-y-zinc-500",
    "border-y-zinc-600",
    "border-y-zinc-700",
    "border-y-zinc-800",
    "border-y-zinc-900",
    "border-y-zinc-950",
    "border-y-neutral-50",
    "border-y-neutral-100",
    "border-y-neutral-200",
    "border-y-neutral-300",
    "border-y-neutral-400",
    "border-y-neutral-500",
    "border-y-neutral-600",
    "border-y-neutral-700",
    "border-y-neutral-800",
    "border-y-neutral-900",
    "border-y-neutral-950",
    "border-y-stone-50",
    "border-y-stone-100",
    "border-y-stone-200",
    "border-y-stone-300",
    "border-y-stone-400",
    "border-y-stone-500",
    "border-y-stone-600",
    "border-y-stone-700",
    "border-y-stone-800",
    "border-y-stone-900",
    "border-y-stone-950",
    "border-y-red-50",
    "border-y-red-100",
    "border-y-red-200",
    "border-y-red-300",
    "border-y-red-400",
    "border-y-red-500",
    "border-y-red-600",
    "border-y-red-700",
    "border-y-red-800",
    "border-y-red-900",
    "border-y-red-950",
    "border-y-orange-50",
    "border-y-orange-100",
    "border-y-orange-200",
    "border-y-orange-300",
    "border-y-orange-400",
    "border-y-orange-500",
    "border-y-orange-600",
    "border-y-orange-700",
    "border-y-orange-800",
    "border-y-orange-900",
    "border-y-orange-950",
    "border-y-amber-50",
    "border-y-amber-100",
    "border-y-amber-200",
    "border-y-amber-300",
    "border-y-amber-400",
    "border-y-amber-500",
    "border-y-amber-600",
    "border-y-amber-700",
    "border-y-amber-800",
    "border-y-amber-900",
    "border-y-amber-950",
    "border-y-yellow-50",
    "border-y-yellow-100",
    "border-y-yellow-200",
    "border-y-yellow-300",
    "border-y-yellow-400",
    "border-y-yellow-500",
    "border-y-yellow-600",
    "border-y-yellow-700",
    "border-y-yellow-800",
    "border-y-yellow-900",
    "border-y-yellow-950",
    "border-y-lime-50",
    "border-y-lime-100",
    "border-y-lime-200",
    "border-y-lime-300",
    "border-y-lime-400",
    "border-y-lime-500",
    "border-y-lime-600",
    "border-y-lime-700",
    "border-y-lime-800",
    "border-y-lime-900",
    "border-y-lime-950",
    "border-y-green-50",
    "border-y-green-100",
    "border-y-green-200",
    "border-y-green-300",
    "border-y-green-400",
    "border-y-green-500",
    "border-y-green-600",
    "border-y-green-700",
    "border-y-green-800",
    "border-y-green-900",
    "border-y-green-950",
    "border-y-emerald-50",
    "border-y-emerald-100",
    "border-y-emerald-200",
    "border-y-emerald-300",
    "border-y-emerald-400",
    "border-y-emerald-500",
    "border-y-emerald-600",
    "border-y-emerald-700",
    "border-y-emerald-800",
    "border-y-emerald-900",
    "border-y-emerald-950",
    "border-y-teal-50",
    "border-y-teal-100",
    "border-y-teal-200",
    "border-y-teal-300",
    "border-y-teal-400",
    "border-y-teal-500",
    "border-y-teal-600",
    "border-y-teal-700",
    "border-y-teal-800",
    "border-y-teal-900",
    "border-y-teal-950",
    "border-y-cyan-50",
    "border-y-cyan-100",
    "border-y-cyan-200",
    "border-y-cyan-300",
    "border-y-cyan-400",
    "border-y-cyan-500",
    "border-y-cyan-600",
    "border-y-cyan-700",
    "border-y-cyan-800",
    "border-y-cyan-900",
    "border-y-cyan-950",
    "border-y-sky-50",
    "border-y-sky-100",
    "border-y-sky-200",
    "border-y-sky-300",
    "border-y-sky-400",
    "border-y-sky-500",
    "border-y-sky-600",
    "border-y-sky-700",
    "border-y-sky-800",
    "border-y-sky-900",
    "border-y-sky-950",
    "border-y-blue-50",
    "border-y-blue-100",
    "border-y-blue-200",
    "border-y-blue-300",
    "border-y-blue-400",
    "border-y-blue-500",
    "border-y-blue-600",
    "border-y-blue-700",
    "border-y-blue-800",
    "border-y-blue-900",
    "border-y-blue-950",
    "border-y-indigo-50",
    "border-y-indigo-100",
    "border-y-indigo-200",
    "border-y-indigo-300",
    "border-y-indigo-400",
    "border-y-indigo-500",
    "border-y-indigo-600",
    "border-y-indigo-700",
    "border-y-indigo-800",
    "border-y-indigo-900",
    "border-y-indigo-950",
    "border-y-violet-50",
    "border-y-violet-100",
    "border-y-violet-200",
    "border-y-violet-300",
    "border-y-violet-400",
    "border-y-violet-500",
    "border-y-violet-600",
    "border-y-violet-700",
    "border-y-violet-800",
    "border-y-violet-900",
    "border-y-violet-950",
    "border-y-purple-50",
    "border-y-purple-100",
    "border-y-purple-200",
    "border-y-purple-300",
    "border-y-purple-400",
    "border-y-purple-500",
    "border-y-purple-600",
    "border-y-purple-700",
    "border-y-purple-800",
    "border-y-purple-900",
    "border-y-purple-950",
    "border-y-fuchsia-50",
    "border-y-fuchsia-100",
    "border-y-fuchsia-200",
    "border-y-fuchsia-300",
    "border-y-fuchsia-400",
    "border-y-fuchsia-500",
    "border-y-fuchsia-600",
    "border-y-fuchsia-700",
    "border-y-fuchsia-800",
    "border-y-fuchsia-900",
    "border-y-fuchsia-950",
    "border-y-pink-50",
    "border-y-pink-100",
    "border-y-pink-200",
    "border-y-pink-300",
    "border-y-pink-400",
    "border-y-pink-500",
    "border-y-pink-600",
    "border-y-pink-700",
    "border-y-pink-800",
    "border-y-pink-900",
    "border-y-pink-950",
    "border-y-rose-50",
    "border-y-rose-100",
    "border-y-rose-200",
    "border-y-rose-300",
    "border-y-rose-400",
    "border-y-rose-500",
    "border-y-rose-600",
    "border-y-rose-700",
    "border-y-rose-800",
    "border-y-rose-900",
    "border-y-rose-950",
    "border-y-sky-50",
    "border-y-sky-100",
    "border-y-sky-200",
    "border-y-sky-300",
    "border-y-sky-400",
    "border-y-sky-500",
    "border-y-sky-600",
    "border-y-sky-700",
    "border-y-sky-800",
    "border-y-sky-900",
    "border-y-sky-950",
    "border-y-stone-50",
    "border-y-stone-100",
    "border-y-stone-200",
    "border-y-stone-300",
    "border-y-stone-400",
    "border-y-stone-500",
    "border-y-stone-600",
    "border-y-stone-700",
    "border-y-stone-800",
    "border-y-stone-900",
    "border-y-stone-950",
    "border-y-neutral-50",
    "border-y-neutral-100",
    "border-y-neutral-200",
    "border-y-neutral-300",
    "border-y-neutral-400",
    "border-y-neutral-500",
    "border-y-neutral-600",
    "border-y-neutral-700",
    "border-y-neutral-800",
    "border-y-neutral-900",
    "border-y-neutral-950",
    "border-y-gray-50",
    "border-y-gray-100",
    "border-y-gray-200",
    "border-y-gray-300",
    "border-y-gray-400",
    "border-y-gray-500",
    "border-y-gray-600",
    "border-y-gray-700",
    "border-y-gray-800",
    "border-y-gray-900",
    "border-y-gray-950",
    "border-y-slate-50",
    "border-y-slate-100",
    "border-y-slate-200",
    "border-y-slate-300",
    "border-y-slate-400",
    "border-y-slate-500",
    "border-y-slate-600",
    "border-y-slate-700",
    "border-y-slate-800",
    "border-y-slate-900",
    "border-y-slate-950",
  ],
  borderTColor: [
    "border-t-inherit",
    "border-t-current",
    "border-t-transparent",
    "border-t-black",
    "border-t-white",
    "border-t-slate-50",
    "border-t-slate-100",
    "border-t-slate-200",
    "border-t-slate-300",
    "border-t-slate-400",
    "border-t-slate-500",
    "border-t-slate-600",
    "border-t-slate-700",
    "border-t-slate-800",
    "border-t-slate-900",
    "border-t-slate-950",
    "border-t-gray-50",
    "border-t-gray-100",
    "border-t-gray-200",
    "border-t-gray-300",
    "border-t-gray-400",
    "border-t-gray-500",
    "border-t-gray-600",
    "border-t-gray-700",
    "border-t-gray-800",
    "border-t-gray-900",
    "border-t-gray-950",
    "border-t-zinc-50",
    "border-t-zinc-100",
    "border-t-zinc-200",
    "border-t-zinc-300",
    "border-t-zinc-400",
    "border-t-zinc-500",
    "border-t-zinc-600",
    "border-t-zinc-700",
    "border-t-zinc-800",
    "border-t-zinc-900",
    "border-t-zinc-950",
    "border-t-neutral-50",
    "border-t-neutral-100",
    "border-t-neutral-200",
    "border-t-neutral-300",
    "border-t-neutral-400",
    "border-t-neutral-500",
    "border-t-neutral-600",
    "border-t-neutral-700",
    "border-t-neutral-800",
    "border-t-neutral-900",
    "border-t-neutral-950",
    "border-t-stone-50",
    "border-t-stone-100",
    "border-t-stone-200",
    "border-t-stone-300",
    "border-t-stone-400",
    "border-t-stone-500",
    "border-t-stone-600",
    "border-t-stone-700",
    "border-t-stone-800",
    "border-t-stone-900",
    "border-t-stone-950",
    "border-t-red-50",
    "border-t-red-100",
    "border-t-red-200",
    "border-t-red-300",
    "border-t-red-400",
    "border-t-red-500",
    "border-t-red-600",
    "border-t-red-700",
    "border-t-red-800",
    "border-t-red-900",
    "border-t-red-950",
    "border-t-orange-50",
    "border-t-orange-100",
    "border-t-orange-200",
    "border-t-orange-300",
    "border-t-orange-400",
    "border-t-orange-500",
    "border-t-orange-600",
    "border-t-orange-700",
    "border-t-orange-800",
    "border-t-orange-900",
    "border-t-orange-950",
    "border-t-amber-50",
    "border-t-amber-100",
    "border-t-amber-200",
    "border-t-amber-300",
    "border-t-amber-400",
    "border-t-amber-500",
    "border-t-amber-600",
    "border-t-amber-700",
    "border-t-amber-800",
    "border-t-amber-900",
    "border-t-amber-950",
    "border-t-yellow-50",
    "border-t-yellow-100",
    "border-t-yellow-200",
    "border-t-yellow-300",
    "border-t-yellow-400",
    "border-t-yellow-500",
    "border-t-yellow-600",
    "border-t-yellow-700",
    "border-t-yellow-800",
    "border-t-yellow-900",
    "border-t-yellow-950",
    "border-t-lime-50",
    "border-t-lime-100",
    "border-t-lime-200",
    "border-t-lime-300",
    "border-t-lime-400",
    "border-t-lime-500",
    "border-t-lime-600",
    "border-t-lime-700",
    "border-t-lime-800",
    "border-t-lime-900",
    "border-t-lime-950",
    "border-t-green-50",
    "border-t-green-100",
    "border-t-green-200",
    "border-t-green-300",
    "border-t-green-400",
    "border-t-green-500",
    "border-t-green-600",
    "border-t-green-700",
    "border-t-green-800",
    "border-t-green-900",
    "border-t-green-950",
    "border-t-emerald-50",
    "border-t-emerald-100",
    "border-t-emerald-200",
    "border-t-emerald-300",
    "border-t-emerald-400",
    "border-t-emerald-500",
    "border-t-emerald-600",
    "border-t-emerald-700",
    "border-t-emerald-800",
    "border-t-emerald-900",
    "border-t-emerald-950",
    "border-t-teal-50",
    "border-t-teal-100",
    "border-t-teal-200",
    "border-t-teal-300",
    "border-t-teal-400",
    "border-t-teal-500",
    "border-t-teal-600",
    "border-t-teal-700",
    "border-t-teal-800",
    "border-t-teal-900",
    "border-t-teal-950",
    "border-t-cyan-50",
    "border-t-cyan-100",
    "border-t-cyan-200",
    "border-t-cyan-300",
    "border-t-cyan-400",
    "border-t-cyan-500",
    "border-t-cyan-600",
    "border-t-cyan-700",
    "border-t-cyan-800",
    "border-t-cyan-900",
    "border-t-cyan-950",
    "border-t-sky-50",
    "border-t-sky-100",
    "border-t-sky-200",
    "border-t-sky-300",
    "border-t-sky-400",
    "border-t-sky-500",
    "border-t-sky-600",
    "border-t-sky-700",
    "border-t-sky-800",
    "border-t-sky-900",
    "border-t-sky-950",
    "border-t-blue-50",
    "border-t-blue-100",
    "border-t-blue-200",
    "border-t-blue-300",
    "border-t-blue-400",
    "border-t-blue-500",
    "border-t-blue-600",
    "border-t-blue-700",
    "border-t-blue-800",
    "border-t-blue-900",
    "border-t-blue-950",
    "border-t-indigo-50",
    "border-t-indigo-100",
    "border-t-indigo-200",
    "border-t-indigo-300",
    "border-t-indigo-400",
    "border-t-indigo-500",
    "border-t-indigo-600",
    "border-t-indigo-700",
    "border-t-indigo-800",
    "border-t-indigo-900",
    "border-t-indigo-950",
    "border-t-violet-50",
    "border-t-violet-100",
    "border-t-violet-200",
    "border-t-violet-300",
    "border-t-violet-400",
    "border-t-violet-500",
    "border-t-violet-600",
    "border-t-violet-700",
    "border-t-violet-800",
    "border-t-violet-900",
    "border-t-violet-950",
    "border-t-purple-50",
    "border-t-purple-100",
    "border-t-purple-200",
    "border-t-purple-300",
    "border-t-purple-400",
    "border-t-purple-500",
    "border-t-purple-600",
    "border-t-purple-700",
    "border-t-purple-800",
    "border-t-purple-900",
    "border-t-purple-950",
    "border-t-fuchsia-50",
    "border-t-fuchsia-100",
    "border-t-fuchsia-200",
    "border-t-fuchsia-300",
    "border-t-fuchsia-400",
    "border-t-fuchsia-500",
    "border-t-fuchsia-600",
    "border-t-fuchsia-700",
    "border-t-fuchsia-800",
    "border-t-fuchsia-900",
    "border-t-fuchsia-950",
    "border-t-pink-50",
    "border-t-pink-100",
    "border-t-pink-200",
    "border-t-pink-300",
    "border-t-pink-400",
    "border-t-pink-500",
    "border-t-pink-600",
    "border-t-pink-700",
    "border-t-pink-800",
    "border-t-pink-900",
    "border-t-pink-950",
    "border-t-rose-50",
    "border-t-rose-100",
    "border-t-rose-200",
    "border-t-rose-300",
    "border-t-rose-400",
    "border-t-rose-500",
    "border-t-rose-600",
    "border-t-rose-700",
    "border-t-rose-800",
    "border-t-rose-900",
    "border-t-rose-950",
    "border-t-sky-50",
    "border-t-sky-100",
    "border-t-sky-200",
    "border-t-sky-300",
    "border-t-sky-400",
    "border-t-sky-500",
    "border-t-sky-600",
    "border-t-sky-700",
    "border-t-sky-800",
    "border-t-sky-900",
    "border-t-sky-950",
    "border-t-stone-50",
    "border-t-stone-100",
    "border-t-stone-200",
    "border-t-stone-300",
    "border-t-stone-400",
    "border-t-stone-500",
    "border-t-stone-600",
    "border-t-stone-700",
    "border-t-stone-800",
    "border-t-stone-900",
    "border-t-stone-950",
    "border-t-neutral-50",
    "border-t-neutral-100",
    "border-t-neutral-200",
    "border-t-neutral-300",
    "border-t-neutral-400",
    "border-t-neutral-500",
    "border-t-neutral-600",
    "border-t-neutral-700",
    "border-t-neutral-800",
    "border-t-neutral-900",
    "border-t-neutral-950",
    "border-t-gray-50",
    "border-t-gray-100",
    "border-t-gray-200",
    "border-t-gray-300",
    "border-t-gray-400",
    "border-t-gray-500",
    "border-t-gray-600",
    "border-t-gray-700",
    "border-t-gray-800",
    "border-t-gray-900",
    "border-t-gray-950",
    "border-t-slate-50",
    "border-t-slate-100",
    "border-t-slate-200",
    "border-t-slate-300",
    "border-t-slate-400",
    "border-t-slate-500",
    "border-t-slate-600",
    "border-t-slate-700",
    "border-t-slate-800",
    "border-t-slate-900",
    "border-t-slate-950",
  ],
  borderBColor: [
    "border-b-inherit",
    "border-b-current",
    "border-b-transparent",
    "border-b-black",
    "border-b-white",
    "border-b-slate-50",
    "border-b-slate-100",
    "border-b-slate-200",
    "border-b-slate-300",
    "border-b-slate-400",
    "border-b-slate-500",
    "border-b-slate-600",
    "border-b-slate-700",
    "border-b-slate-800",
    "border-b-slate-900",
    "border-b-slate-950",
    "border-b-gray-50",
    "border-b-gray-100",
    "border-b-gray-200",
    "border-b-gray-300",
    "border-b-gray-400",
    "border-b-gray-500",
    "border-b-gray-600",
    "border-b-gray-700",
    "border-b-gray-800",
    "border-b-gray-900",
    "border-b-gray-950",
    "border-b-zinc-50",
    "border-b-zinc-100",
    "border-b-zinc-200",
    "border-b-zinc-300",
    "border-b-zinc-400",
    "border-b-zinc-500",
    "border-b-zinc-600",
    "border-b-zinc-700",
    "border-b-zinc-800",
    "border-b-zinc-900",
    "border-b-zinc-950",
    "border-b-neutral-50",
    "border-b-neutral-100",
    "border-b-neutral-200",
    "border-b-neutral-300",
    "border-b-neutral-400",
    "border-b-neutral-500",
    "border-b-neutral-600",
    "border-b-neutral-700",
    "border-b-neutral-800",
    "border-b-neutral-900",
    "border-b-neutral-950",
    "border-b-stone-50",
    "border-b-stone-100",
    "border-b-stone-200",
    "border-b-stone-300",
    "border-b-stone-400",
    "border-b-stone-500",
    "border-b-stone-600",
    "border-b-stone-700",
    "border-b-stone-800",
    "border-b-stone-900",
    "border-b-stone-950",
    "border-b-red-50",
    "border-b-red-100",
    "border-b-red-200",
    "border-b-red-300",
    "border-b-red-400",
    "border-b-red-500",
    "border-b-red-600",
    "border-b-red-700",
    "border-b-red-800",
    "border-b-red-900",
    "border-b-red-950",
    "border-b-orange-50",
    "border-b-orange-100",
    "border-b-orange-200",
    "border-b-orange-300",
    "border-b-orange-400",
    "border-b-orange-500",
    "border-b-orange-600",
    "border-b-orange-700",
    "border-b-orange-800",
    "border-b-orange-900",
    "border-b-orange-950",
    "border-b-amber-50",
    "border-b-amber-100",
    "border-b-amber-200",
    "border-b-amber-300",
    "border-b-amber-400",
    "border-b-amber-500",
    "border-b-amber-600",
    "border-b-amber-700",
    "border-b-amber-800",
    "border-b-amber-900",
    "border-b-amber-950",
    "border-b-yellow-50",
    "border-b-yellow-100",
    "border-b-yellow-200",
    "border-b-yellow-300",
    "border-b-yellow-400",
    "border-b-yellow-500",
    "border-b-yellow-600",
    "border-b-yellow-700",
    "border-b-yellow-800",
    "border-b-yellow-900",
    "border-b-yellow-950",
    "border-b-lime-50",
    "border-b-lime-100",
    "border-b-lime-200",
    "border-b-lime-300",
    "border-b-lime-400",
    "border-b-lime-500",
    "border-b-lime-600",
    "border-b-lime-700",
    "border-b-lime-800",
    "border-b-lime-900",
    "border-b-lime-950",
    "border-b-green-50",
    "border-b-green-100",
    "border-b-green-200",
    "border-b-green-300",
    "border-b-green-400",
    "border-b-green-500",
    "border-b-green-600",
    "border-b-green-700",
    "border-b-green-800",
    "border-b-green-900",
    "border-b-green-950",
    "border-b-emerald-50",
    "border-b-emerald-100",
    "border-b-emerald-200",
    "border-b-emerald-300",
    "border-b-emerald-400",
    "border-b-emerald-500",
    "border-b-emerald-600",
    "border-b-emerald-700",
    "border-b-emerald-800",
    "border-b-emerald-900",
    "border-b-emerald-950",
    "border-b-teal-50",
    "border-b-teal-100",
    "border-b-teal-200",
    "border-b-teal-300",
    "border-b-teal-400",
    "border-b-teal-500",
    "border-b-teal-600",
    "border-b-teal-700",
    "border-b-teal-800",
    "border-b-teal-900",
    "border-b-teal-950",
    "border-b-cyan-50",
    "border-b-cyan-100",
    "border-b-cyan-200",
    "border-b-cyan-300",
    "border-b-cyan-400",
    "border-b-cyan-500",
    "border-b-cyan-600",
    "border-b-cyan-700",
    "border-b-cyan-800",
    "border-b-cyan-900",
    "border-b-cyan-950",
    "border-b-sky-50",
    "border-b-sky-100",
    "border-b-sky-200",
    "border-b-sky-300",
    "border-b-sky-400",
    "border-b-sky-500",
    "border-b-sky-600",
    "border-b-sky-700",
    "border-b-sky-800",
    "border-b-sky-900",
    "border-b-sky-950",
    "border-b-blue-50",
    "border-b-blue-100",
    "border-b-blue-200",
    "border-b-blue-300",
    "border-b-blue-400",
    "border-b-blue-500",
    "border-b-blue-600",
    "border-b-blue-700",
    "border-b-blue-800",
    "border-b-blue-900",
    "border-b-blue-950",
    "border-b-indigo-50",
    "border-b-indigo-100",
    "border-b-indigo-200",
    "border-b-indigo-300",
    "border-b-indigo-400",
    "border-b-indigo-500",
    "border-b-indigo-600",
    "border-b-indigo-700",
    "border-b-indigo-800",
    "border-b-indigo-900",
    "border-b-indigo-950",
    "border-b-violet-50",
    "border-b-violet-100",
    "border-b-violet-200",
    "border-b-violet-300",
    "border-b-violet-400",
    "border-b-violet-500",
    "border-b-violet-600",
    "border-b-violet-700",
    "border-b-violet-800",
    "border-b-violet-900",
    "border-b-violet-950",
    "border-b-purple-50",
    "border-b-purple-100",
    "border-b-purple-200",
    "border-b-purple-300",
    "border-b-purple-400",
    "border-b-purple-500",
    "border-b-purple-600",
    "border-b-purple-700",
    "border-b-purple-800",
    "border-b-purple-900",
    "border-b-purple-950",
    "border-b-fuchsia-50",
    "border-b-fuchsia-100",
    "border-b-fuchsia-200",
    "border-b-fuchsia-300",
    "border-b-fuchsia-400",
    "border-b-fuchsia-500",
    "border-b-fuchsia-600",
    "border-b-fuchsia-700",
    "border-b-fuchsia-800",
    "border-b-fuchsia-900",
    "border-b-fuchsia-950",
    "border-b-pink-50",
    "border-b-pink-100",
    "border-b-pink-200",
    "border-b-pink-300",
    "border-b-pink-400",
    "border-b-pink-500",
    "border-b-pink-600",
    "border-b-pink-700",
    "border-b-pink-800",
    "border-b-pink-900",
    "border-b-pink-950",
    "border-b-rose-50",
    "border-b-rose-100",
    "border-b-rose-200",
    "border-b-rose-300",
    "border-b-rose-400",
    "border-b-rose-500",
    "border-b-rose-600",
    "border-b-rose-700",
    "border-b-rose-800",
    "border-b-rose-900",
    "border-b-rose-950",
    "border-b-sky-50",
    "border-b-sky-100",
    "border-b-sky-200",
    "border-b-sky-300",
    "border-b-sky-400",
    "border-b-sky-500",
    "border-b-sky-600",
    "border-b-sky-700",
    "border-b-sky-800",
    "border-b-sky-900",
    "border-b-sky-950",
    "border-b-stone-50",
    "border-b-stone-100",
    "border-b-stone-200",
    "border-b-stone-300",
    "border-b-stone-400",
    "border-b-stone-500",
    "border-b-stone-600",
    "border-b-stone-700",
    "border-b-stone-800",
    "border-b-stone-900",
    "border-b-stone-950",
    "border-b-neutral-50",
    "border-b-neutral-100",
    "border-b-neutral-200",
    "border-b-neutral-300",
    "border-b-neutral-400",
    "border-b-neutral-500",
    "border-b-neutral-600",
    "border-b-neutral-700",
    "border-b-neutral-800",
    "border-b-neutral-900",
    "border-b-neutral-950",
    "border-b-gray-50",
    "border-b-gray-100",
    "border-b-gray-200",
    "border-b-gray-300",
    "border-b-gray-400",
    "border-b-gray-500",
    "border-b-gray-600",
    "border-b-gray-700",
    "border-b-gray-800",
    "border-b-gray-900",
    "border-b-gray-950",
    "border-b-slate-50",
    "border-b-slate-100",
    "border-b-slate-200",
    "border-b-slate-300",
    "border-b-slate-400",
    "border-b-slate-500",
    "border-b-slate-600",
    "border-b-slate-700",
    "border-b-slate-800",
    "border-b-slate-900",
    "border-b-slate-950",
  ],
  borderLColor: [
    "border-l-inherit",
    "border-l-current",
    "border-l-transparent",
    "border-l-black",
    "border-l-white",
    "border-l-slate-50",
    "border-l-slate-100",
    "border-l-slate-200",
    "border-l-slate-300",
    "border-l-slate-400",
    "border-l-slate-500",
    "border-l-slate-600",
    "border-l-slate-700",
    "border-l-slate-800",
    "border-l-slate-900",
    "border-l-slate-950",
    "border-l-gray-50",
    "border-l-gray-100",
    "border-l-gray-200",
    "border-l-gray-300",
    "border-l-gray-400",
    "border-l-gray-500",
    "border-l-gray-600",
    "border-l-gray-700",
    "border-l-gray-800",
    "border-l-gray-900",
    "border-l-gray-950",
    "border-l-zinc-50",
    "border-l-zinc-100",
    "border-l-zinc-200",
    "border-l-zinc-300",
    "border-l-zinc-400",
    "border-l-zinc-500",
    "border-l-zinc-600",
    "border-l-zinc-700",
    "border-l-zinc-800",
    "border-l-zinc-900",
    "border-l-zinc-950",
    "border-l-neutral-50",
    "border-l-neutral-100",
    "border-l-neutral-200",
    "border-l-neutral-300",
    "border-l-neutral-400",
    "border-l-neutral-500",
    "border-l-neutral-600",
    "border-l-neutral-700",
    "border-l-neutral-800",
    "border-l-neutral-900",
    "border-l-neutral-950",
    "border-l-stone-50",
    "border-l-stone-100",
    "border-l-stone-200",
    "border-l-stone-300",
    "border-l-stone-400",
    "border-l-stone-500",
    "border-l-stone-600",
    "border-l-stone-700",
    "border-l-stone-800",
    "border-l-stone-900",
    "border-l-stone-950",
    "border-l-red-50",
    "border-l-red-100",
    "border-l-red-200",
    "border-l-red-300",
    "border-l-red-400",
    "border-l-red-500",
    "border-l-red-600",
    "border-l-red-700",
    "border-l-red-800",
    "border-l-red-900",
    "border-l-red-950",
    "border-l-orange-50",
    "border-l-orange-100",
    "border-l-orange-200",
    "border-l-orange-300",
    "border-l-orange-400",
    "border-l-orange-500",
    "border-l-orange-600",
    "border-l-orange-700",
    "border-l-orange-800",
    "border-l-orange-900",
    "border-l-orange-950",
    "border-l-amber-50",
    "border-l-amber-100",
    "border-l-amber-200",
    "border-l-amber-300",
    "border-l-amber-400",
    "border-l-amber-500",
    "border-l-amber-600",
    "border-l-amber-700",
    "border-l-amber-800",
    "border-l-amber-900",
    "border-l-amber-950",
    "border-l-yellow-50",
    "border-l-yellow-100",
    "border-l-yellow-200",
    "border-l-yellow-300",
    "border-l-yellow-400",
    "border-l-yellow-500",
    "border-l-yellow-600",
    "border-l-yellow-700",
    "border-l-yellow-800",
    "border-l-yellow-900",
    "border-l-yellow-950",
    "border-l-lime-50",
    "border-l-lime-100",
    "border-l-lime-200",
    "border-l-lime-300",
    "border-l-lime-400",
    "border-l-lime-500",
    "border-l-lime-600",
    "border-l-lime-700",
    "border-l-lime-800",
    "border-l-lime-900",
    "border-l-lime-950",
    "border-l-green-50",
    "border-l-green-100",
    "border-l-green-200",
    "border-l-green-300",
    "border-l-green-400",
    "border-l-green-500",
    "border-l-green-600",
    "border-l-green-700",
    "border-l-green-800",
    "border-l-green-900",
    "border-l-green-950",
    "border-l-emerald-50",
    "border-l-emerald-100",
    "border-l-emerald-200",
    "border-l-emerald-300",
    "border-l-emerald-400",
    "border-l-emerald-500",
    "border-l-emerald-600",
    "border-l-emerald-700",
    "border-l-emerald-800",
    "border-l-emerald-900",
    "border-l-emerald-950",
    "border-l-teal-50",
    "border-l-teal-100",
    "border-l-teal-200",
    "border-l-teal-300",
    "border-l-teal-400",
    "border-l-teal-500",
    "border-l-teal-600",
    "border-l-teal-700",
    "border-l-teal-800",
    "border-l-teal-900",
    "border-l-teal-950",
    "border-l-cyan-50",
    "border-l-cyan-100",
    "border-l-cyan-200",
    "border-l-cyan-300",
    "border-l-cyan-400",
    "border-l-cyan-500",
    "border-l-cyan-600",
    "border-l-cyan-700",
    "border-l-cyan-800",
    "border-l-cyan-900",
    "border-l-cyan-950",
    "border-l-sky-50",
    "border-l-sky-100",
    "border-l-sky-200",
    "border-l-sky-300",
    "border-l-sky-400",
    "border-l-sky-500",
    "border-l-sky-600",
    "border-l-sky-700",
    "border-l-sky-800",
    "border-l-sky-900",
    "border-l-sky-950",
    "border-l-blue-50",
    "border-l-blue-100",
    "border-l-blue-200",
    "border-l-blue-300",
    "border-l-blue-400",
    "border-l-blue-500",
    "border-l-blue-600",
    "border-l-blue-700",
    "border-l-blue-800",
    "border-l-blue-900",
    "border-l-blue-950",
    "border-l-indigo-50",
    "border-l-indigo-100",
    "border-l-indigo-200",
    "border-l-indigo-300",
    "border-l-indigo-400",
    "border-l-indigo-500",
    "border-l-indigo-600",
    "border-l-indigo-700",
    "border-l-indigo-800",
    "border-l-indigo-900",
    "border-l-indigo-950",
    "border-l-violet-50",
    "border-l-violet-100",
    "border-l-violet-200",
    "border-l-violet-300",
    "border-l-violet-400",
    "border-l-violet-500",
    "border-l-violet-600",
    "border-l-violet-700",
    "border-l-violet-800",
    "border-l-violet-900",
    "border-l-violet-950",
    "border-l-purple-50",
    "border-l-purple-100",
    "border-l-purple-200",
    "border-l-purple-300",
    "border-l-purple-400",
    "border-l-purple-500",
    "border-l-purple-600",
    "border-l-purple-700",
    "border-l-purple-800",
    "border-l-purple-900",
    "border-l-purple-950",
    "border-l-fuchsia-50",
    "border-l-fuchsia-100",
    "border-l-fuchsia-200",
    "border-l-fuchsia-300",
    "border-l-fuchsia-400",
    "border-l-fuchsia-500",
    "border-l-fuchsia-600",
    "border-l-fuchsia-700",
    "border-l-fuchsia-800",
    "border-l-fuchsia-900",
    "border-l-fuchsia-950",
    "border-l-pink-50",
    "border-l-pink-100",
    "border-l-pink-200",
    "border-l-pink-300",
    "border-l-pink-400",
    "border-l-pink-500",
    "border-l-pink-600",
    "border-l-pink-700",
    "border-l-pink-800",
    "border-l-pink-900",
    "border-l-pink-950",
    "border-l-rose-50",
    "border-l-rose-100",
    "border-l-rose-200",
    "border-l-rose-300",
    "border-l-rose-400",
    "border-l-rose-500",
    "border-l-rose-600",
    "border-l-rose-700",
    "border-l-rose-800",
    "border-l-rose-900",
    "border-l-rose-950",
    "border-l-sky-50",
    "border-l-sky-100",
    "border-l-sky-200",
    "border-l-sky-300",
    "border-l-sky-400",
    "border-l-sky-500",
    "border-l-sky-600",
    "border-l-sky-700",
    "border-l-sky-800",
    "border-l-sky-900",
    "border-l-sky-950",
    "border-l-stone-50",
    "border-l-stone-100",
    "border-l-stone-200",
    "border-l-stone-300",
    "border-l-stone-400",
    "border-l-stone-500",
    "border-l-stone-600",
    "border-l-stone-700",
    "border-l-stone-800",
    "border-l-stone-900",
    "border-l-stone-950",
    "border-l-neutral-50",
    "border-l-neutral-100",
    "border-l-neutral-200",
    "border-l-neutral-300",
    "border-l-neutral-400",
    "border-l-neutral-500",
    "border-l-neutral-600",
    "border-l-neutral-700",
    "border-l-neutral-800",
    "border-l-neutral-900",
    "border-l-neutral-950",
    "border-l-gray-50",
    "border-l-gray-100",
    "border-l-gray-200",
    "border-l-gray-300",
    "border-l-gray-400",
    "border-l-gray-500",
    "border-l-gray-600",
    "border-l-gray-700",
    "border-l-gray-800",
    "border-l-gray-900",
    "border-l-gray-950",
    "border-l-slate-50",
    "border-l-slate-100",
    "border-l-slate-200",
    "border-l-slate-300",
    "border-l-slate-400",
    "border-l-slate-500",
    "border-l-slate-600",
    "border-l-slate-700",
    "border-l-slate-800",
    "border-l-slate-900",
    "border-l-slate-950",
  ],
  borderRColor: [
    "border-r-inherit",
    "border-r-current",
    "border-r-transparent",
    "border-r-black",
    "border-r-white",
    "border-r-slate-50",
    "border-r-slate-100",
    "border-r-slate-200",
    "border-r-slate-300",
    "border-r-slate-400",
    "border-r-slate-500",
    "border-r-slate-600",
    "border-r-slate-700",
    "border-r-slate-800",
    "border-r-slate-900",
    "border-r-slate-950",
    "border-r-gray-50",
    "border-r-gray-100",
    "border-r-gray-200",
    "border-r-gray-300",
    "border-r-gray-400",
    "border-r-gray-500",
    "border-r-gray-600",
    "border-r-gray-700",
    "border-r-gray-800",
    "border-r-gray-900",
    "border-r-gray-950",
    "border-r-zinc-50",
    "border-r-zinc-100",
    "border-r-zinc-200",
    "border-r-zinc-300",
    "border-r-zinc-400",
    "border-r-zinc-500",
    "border-r-zinc-600",
    "border-r-zinc-700",
    "border-r-zinc-800",
    "border-r-zinc-900",
    "border-r-zinc-950",
    "border-r-neutral-50",
    "border-r-neutral-100",
    "border-r-neutral-200",
    "border-r-neutral-300",
    "border-r-neutral-400",
    "border-r-neutral-500",
    "border-r-neutral-600",
    "border-r-neutral-700",
    "border-r-neutral-800",
    "border-r-neutral-900",
    "border-r-neutral-950",
    "border-r-stone-50",
    "border-r-stone-100",
    "border-r-stone-200",
    "border-r-stone-300",
    "border-r-stone-400",
    "border-r-stone-500",
    "border-r-stone-600",
    "border-r-stone-700",
    "border-r-stone-800",
    "border-r-stone-900",
    "border-r-stone-950",
    "border-r-red-50",
    "border-r-red-100",
    "border-r-red-200",
    "border-r-red-300",
    "border-r-red-400",
    "border-r-red-500",
    "border-r-red-600",
    "border-r-red-700",
    "border-r-red-800",
    "border-r-red-900",
    "border-r-red-950",
    "border-r-orange-50",
    "border-r-orange-100",
    "border-r-orange-200",
    "border-r-orange-300",
    "border-r-orange-400",
    "border-r-orange-500",
    "border-r-orange-600",
    "border-r-orange-700",
    "border-r-orange-800",
    "border-r-orange-900",
    "border-r-orange-950",
    "border-r-amber-50",
    "border-r-amber-100",
    "border-r-amber-200",
    "border-r-amber-300",
    "border-r-amber-400",
    "border-r-amber-500",
    "border-r-amber-600",
    "border-r-amber-700",
    "border-r-amber-800",
    "border-r-amber-900",
    "border-r-amber-950",
    "border-r-yellow-50",
    "border-r-yellow-100",
    "border-r-yellow-200",
    "border-r-yellow-300",
    "border-r-yellow-400",
    "border-r-yellow-500",
    "border-r-yellow-600",
    "border-r-yellow-700",
    "border-r-yellow-800",
    "border-r-yellow-900",
    "border-r-yellow-950",
    "border-r-lime-50",
    "border-r-lime-100",
    "border-r-lime-200",
    "border-r-lime-300",
    "border-r-lime-400",
    "border-r-lime-500",
    "border-r-lime-600",
    "border-r-lime-700",
    "border-r-lime-800",
    "border-r-lime-900",
    "border-r-lime-950",
    "border-r-green-50",
    "border-r-green-100",
    "border-r-green-200",
    "border-r-green-300",
    "border-r-green-400",
    "border-r-green-500",
    "border-r-green-600",
    "border-r-green-700",
    "border-r-green-800",
    "border-r-green-900",
    "border-r-green-950",
    "border-r-emerald-50",
    "border-r-emerald-100",
    "border-r-emerald-200",
    "border-r-emerald-300",
    "border-r-emerald-400",
    "border-r-emerald-500",
    "border-r-emerald-600",
    "border-r-emerald-700",
    "border-r-emerald-800",
    "border-r-emerald-900",
    "border-r-emerald-950",
    "border-r-teal-50",
    "border-r-teal-100",
    "border-r-teal-200",
    "border-r-teal-300",
    "border-r-teal-400",
    "border-r-teal-500",
    "border-r-teal-600",
    "border-r-teal-700",
    "border-r-teal-800",
    "border-r-teal-900",
    "border-r-teal-950",
    "border-r-cyan-50",
    "border-r-cyan-100",
    "border-r-cyan-200",
    "border-r-cyan-300",
    "border-r-cyan-400",
    "border-r-cyan-500",
    "border-r-cyan-600",
    "border-r-cyan-700",
    "border-r-cyan-800",
    "border-r-cyan-900",
    "border-r-cyan-950",
    "border-r-sky-50",
    "border-r-sky-100",
    "border-r-sky-200",
    "border-r-sky-300",
    "border-r-sky-400",
    "border-r-sky-500",
    "border-r-sky-600",
    "border-r-sky-700",
    "border-r-sky-800",
    "border-r-sky-900",
    "border-r-sky-950",
    "border-r-blue-50",
    "border-r-blue-100",
    "border-r-blue-200",
    "border-r-blue-300",
    "border-r-blue-400",
    "border-r-blue-500",
    "border-r-blue-600",
    "border-r-blue-700",
    "border-r-blue-800",
    "border-r-blue-900",
    "border-r-blue-950",
    "border-r-indigo-50",
    "border-r-indigo-100",
    "border-r-indigo-200",
    "border-r-indigo-300",
    "border-r-indigo-400",
    "border-r-indigo-500",
    "border-r-indigo-600",
    "border-r-indigo-700",
    "border-r-indigo-800",
    "border-r-indigo-900",
    "border-r-indigo-950",
    "border-r-violet-50",
    "border-r-violet-100",
    "border-r-violet-200",
    "border-r-violet-300",
    "border-r-violet-400",
    "border-r-violet-500",
    "border-r-violet-600",
    "border-r-violet-700",
    "border-r-violet-800",
    "border-r-violet-900",
    "border-r-violet-950",
    "border-r-purple-50",
    "border-r-purple-100",
    "border-r-purple-200",
    "border-r-purple-300",
    "border-r-purple-400",
    "border-r-purple-500",
    "border-r-purple-600",
    "border-r-purple-700",
    "border-r-purple-800",
    "border-r-purple-900",
    "border-r-purple-950",
    "border-r-fuchsia-50",
    "border-r-fuchsia-100",
    "border-r-fuchsia-200",
    "border-r-fuchsia-300",
    "border-r-fuchsia-400",
    "border-r-fuchsia-500",
    "border-r-fuchsia-600",
    "border-r-fuchsia-700",
    "border-r-fuchsia-800",
    "border-r-fuchsia-900",
    "border-r-fuchsia-950",
    "border-r-pink-50",
    "border-r-pink-100",
    "border-r-pink-200",
    "border-r-pink-300",
    "border-r-pink-400",
    "border-r-pink-500",
    "border-r-pink-600",
    "border-r-pink-700",
    "border-r-pink-800",
    "border-r-pink-900",
    "border-r-pink-950",
    "border-r-rose-50",
    "border-r-rose-100",
    "border-r-rose-200",
    "border-r-rose-300",
    "border-r-rose-400",
    "border-r-rose-500",
    "border-r-rose-600",
    "border-r-rose-700",
    "border-r-rose-800",
    "border-r-rose-900",
    "border-r-rose-950",
    "border-r-sky-50",
    "border-r-sky-100",
    "border-r-sky-200",
    "border-r-sky-300",
    "border-r-sky-400",
    "border-r-sky-500",
    "border-r-sky-600",
    "border-r-sky-700",
    "border-r-sky-800",
    "border-r-sky-900",
    "border-r-sky-950",
    "border-r-stone-50",
    "border-r-stone-100",
    "border-r-stone-200",
    "border-r-stone-300",
    "border-r-stone-400",
    "border-r-stone-500",
    "border-r-stone-600",
    "border-r-stone-700",
    "border-r-stone-800",
    "border-r-stone-900",
    "border-r-stone-950",
    "border-r-neutral-50",
    "border-r-neutral-100",
    "border-r-neutral-200",
    "border-r-neutral-300",
    "border-r-neutral-400",
    "border-r-neutral-500",
    "border-r-neutral-600",
    "border-r-neutral-700",
    "border-r-neutral-800",
    "border-r-neutral-900",
    "border-r-neutral-950",
    "border-r-gray-50",
    "border-r-gray-100",
    "border-r-gray-200",
    "border-r-gray-300",
    "border-r-gray-400",
    "border-r-gray-500",
    "border-r-gray-600",
    "border-r-gray-700",
    "border-r-gray-800",
    "border-r-gray-900",
    "border-r-gray-950",
    "border-r-slate-50",
    "border-r-slate-100",
    "border-r-slate-200",
    "border-r-slate-300",
    "border-r-slate-400",
    "border-r-slate-500",
    "border-r-slate-600",
    "border-r-slate-700",
    "border-r-slate-800",
    "border-r-slate-900",
    "border-r-slate-950",
  ],
  borderWidth: [
    "border-0",
    "border-2",
    "border-4",
    "border-8",
    "border-x-0",
    "border-x-2",
    "border-x-4",
    "border-x-8",
    "border-x",
    "border-y-0",
    "border-y-2",
    "border-y-4",
    "border-y-8",
    "border-y",
    "border-s-0",
    "border-s-2",
    "border-s-4",
    "border-s-8",
    "border-s",
    "border-e-0",
    "border-e-2",
    "border-e-4",
    "border-e-8",
    "border-e",
    "border-t-0",
    "border-t-2",
    "border-t-4",
    "border-t-8",
    "border-t",
    "border-r-0",
    "border-r-2",
    "border-r-4",
    "border-r-8",
    "border-r",
    "border-b-0",
    "border-b-2",
    "border-b-4",
    "border-b-8",
    "border-b",
    "border-l-0",
    "border-l-2",
    "border-l-4",
    "border-l-8",
    "border-l",
  ],
  flexDirection: [
    "flex-row",
    "flex-row-reverse",
    "flex-col",
    "flex-col-reverse",
  ],
  alignItems: [
    "items-start",
    "items-end",
    "items-center",
    "items-baseline",
    "items-stretch",
  ],
  justifyContent: [
    "justify-normal",
    "justify-start",
    "justify-end",
    "justify-center",
    "justify-between",
    "justify-around",
    "justify-evenly",
    "justify-stretch",
  ],
  flexBasis: [
    "basis-0",
    "basis-1",
    "basis-2",
    "basis-3",
    "basis-4",
    "basis-5",
    "basis-6",
    "basis-7",
    "basis-8",
    "basis-9",
    "basis-10",
    "basis-11",
    "basis-12",
    "basis-14",
    "basis-16",
    "basis-20",
    "basis-24",
    "basis-28",
    "basis-32",
    "basis-36",
    "basis-40",
    "basis-44",
    "basis-48",
    "basis-52",
    "basis-56",
    "basis-60",
    "basis-64",
    "basis-72",
    "basis-80",
    "basis-96",
    "basis-auto",
    "basis-px",
    "basis-0.5",
    "basis-1.5",
    "basis-2.5",
    "basis-3.5",
    "basis-1/2",
    "basis-1/3",
    "basis-2/3",
    "basis-1/4",
    "basis-2/4",
    "basis-3/4",
    "basis-1/5",
    "basis-2/5",
    "basis-3/5",
    "basis-4/5",
    "basis-1/6",
    "basis-2/6",
    "basis-3/6",
    "basis-4/6",
    "basis-5/6",
    "basis-1/12",
    "basis-2/12",
    "basis-3/12",
    "basis-4/12",
    "basis-5/12",
    "basis-6/12",
    "basis-7/12",
    "basis-8/12",
    "basis-9/12",
    "basis-10/12",
    "basis-11/12",
    "basis-full",
  ],
  flexGrowShrink: ["grow", "grow-0", "shrink", "shrink-0"],
  gap: [
    "gap-0",
    "gap-px",
    "gap-0.5",
    "gap-1",
    "gap-1.5",
    "gap-2",
    "gap-2.5",
    "gap-3",
    "gap-3.5",
    "gap-4",
    "gap-5",
    "gap-6",
    "gap-7",
    "gap-8",
    "gap-9",
    "gap-10",
    "gap-11",
    "gap-12",
    "gap-14",
    "gap-16",
    "gap-20",
    "gap-24",
    "gap-28",
    "gap-32",
    "gap-36",
    "gap-40",
    "gap-44",
    "gap-48",
    "gap-52",
    "gap-56",
    "gap-60",
    "gap-64",
    "gap-72",
    "gap-80",
    "gap-96",
  ],
  gapX: [
    "gap-x-0",
    "gap-x-px",
    "gap-x-0.5",
    "gap-x-1",
    "gap-x-1.5",
    "gap-x-2",
    "gap-x-2.5",
    "gap-x-3",
    "gap-x-3.5",
    "gap-x-4",
    "gap-x-5",
    "gap-x-6",
    "gap-x-7",
    "gap-x-8",
    "gap-x-9",
    "gap-x-10",
    "gap-x-11",
    "gap-x-12",
    "gap-x-14",
    "gap-x-16",
    "gap-x-20",
    "gap-x-24",
    "gap-x-28",
    "gap-x-32",
    "gap-x-36",
    "gap-x-40",
    "gap-x-44",
    "gap-x-48",
    "gap-x-52",
    "gap-x-56",
    "gap-x-60",
    "gap-x-64",
    "gap-x-72",
    "gap-x-80",
    "gap-x-96",
  ],
  gapY: [
    "gap-y-0",
    "gap-y-px",
    "gap-y-0.5",
    "gap-y-1",
    "gap-y-1.5",
    "gap-y-2",
    "gap-y-2.5",
    "gap-y-3",
    "gap-y-3.5",
    "gap-y-4",
    "gap-y-5",
    "gap-y-6",
    "gap-y-7",
    "gap-y-8",
    "gap-y-9",
    "gap-y-10",
    "gap-y-11",
    "gap-y-12",
    "gap-y-14",
    "gap-y-16",
    "gap-y-20",
    "gap-y-24",
    "gap-y-28",
    "gap-y-32",
    "gap-y-36",
    "gap-y-40",
    "gap-y-44",
    "gap-y-48",
    "gap-y-52",
    "gap-y-56",
    "gap-y-60",
    "gap-y-64",
    "gap-y-72",
    "gap-y-80",
    "gap-y-96",
  ],
  gridColumns: [
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
    "grid-cols-9",
    "grid-cols-10",
    "grid-cols-11",
    "grid-cols-12",
    "rid-cols-none",
  ],
  gridRows: [
    "grid-rows-1",
    "grid-rows-2",
    "grid-rows-3",
    "grid-rows-4",
    "grid-rows-5",
    "grid-rows-6",
    "grid-rows-none",
  ],
};



================================================
FILE: src/helpers/index.js
================================================
import { useSelector } from "react-redux";
import { classes } from "../configs/tailwind";
import { getResponsivePrefix, getResponsivePrefixes } from "../utils";

const getNode = (dom, id) => {
  let resultNode = null;
  if (id) {
    const checkEndReturnNode = (node) => {
      if (node.children)
        node.children.forEach((n) => {
          n.id !== id ? checkEndReturnNode(n) : (resultNode = n);
        });
    };

    dom?.forEach((node) => {
      node.id !== id ? checkEndReturnNode(node) : (resultNode = node);
    });
  }

  return resultNode;
};

const getParentNode = (dom, id) => {
  let resultNode = null;
  if (id) {
    const checkEndReturnNode = (node) => {
      if (node.children)
        node.children.forEach((n) => {
          n.id !== id ? checkEndReturnNode(n) : (resultNode = node);
        });
    };

    dom?.forEach((node) => {
      node.id !== id ? checkEndReturnNode(node) : (resultNode = null);
    });
  }

  return resultNode;
};

export const useSelectedNode = () => {
  const { dom, selectedSection } = useSelector((state) => state.data);
  return getNode(dom, selectedSection?.id);
};

export const useSelectedLayout = () => {
  const { dom, selectedSection } = useSelector((state) => state.data);
  const { responsiveView } = useSelector((state) => state.layout);
  const node = getNode(dom, selectedSection?.id);

  if (node?.className) {
    const cls = node.className.split(" ");
    let result = null;

    getResponsivePrefixes(responsiveView).map((view) => {
      if (!result?.length)
        result = classes.display.filter(
          (d) => cls.indexOf(`${view}${d}`) != -1
        );
    });

    return result.length > 0 ? result[0] : null;
  } else {
    return null;
  }
};

export const useParentLayout = () => {
  const { dom, selectedSection } = useSelector((state) => state.data);
  const { responsiveView } = useSelector((state) => state.layout);
  const node = getParentNode(dom, selectedSection?.id);

  if (node?.className) {
    const cls = node.className.split(" ");
    let result = null;

    getResponsivePrefixes(responsiveView).map((view) => {
      if (!result?.length)
        result = classes.display.filter(
          (d) => cls.indexOf(`${view}${d}`) != -1
        );
    });

    return result.length > 0 ? result[0] : null;
  } else {
    return null;
  }
};

export const useShadowProps = () => {
  const { dom, selectedSection } = useSelector((state) => state.data);
  const { responsiveView } = useSelector((state) => state.layout);
  let resultNode = getNode(dom, selectedSection?.id);
  let isFound = false;

  resultNode?.className?.split(" ").forEach((elm) => {
    if (elm.indexOf(`${getResponsivePrefix(responsiveView)}shadow-[`) === 0)
      isFound = true;
  });

  if (isFound) {
    let shadowPropsString = resultNode?.className.split(
      `${getResponsivePrefix(responsiveView)}shadow-[`
    );
    shadowPropsString = shadowPropsString[1].split("]");
    shadowPropsString = shadowPropsString[0].split("_");

    return {
      shadowHorizontalLength: shadowPropsString[0],
      shadowVerticalLength: shadowPropsString[1],
      shadowBlur: shadowPropsString[2],
      shadowSpread: shadowPropsString[3],
      shadowColor: shadowPropsString[4],
    };
  } else {
    return {};
  }
};

export const useBordersProps = () => {
  const { dom, selectedSection } = useSelector((state) => state.data);
  const { responsiveView } = useSelector((state) => state.layout);
  let resultNode = getNode(dom, selectedSection?.id);
  let isBorder = false;

  const getClassName = (name) => {
    if (name.includes(`${getResponsivePrefix(responsiveView)}border-r-`))
      return "borderRColor";
    if (name.includes(`${getResponsivePrefix(responsiveView)}border-l-`))
      return "borderLColor";
    if (name.includes(`${getResponsivePrefix(responsiveView)}border-t-`))
      return "borderTColor";
    if (name.includes(`${getResponsivePrefix(responsiveView)}border-b-`))
      return "borderBColor";
    return "borderColor";
  };

  resultNode?.className?.split(" ").forEach((c) => {
    if (c.indexOf(`${getResponsivePrefix(responsiveView)}border-`) === 0)
      isBorder = true;
  });

  if (isBorder) {
    let borderWidth = null;
    let borderStyle = null;
    let borderColor = null;

    const cls = resultNode.className
      .split(" ")
      .filter((item) =>
        item.includes(`${getResponsivePrefix(responsiveView)}border-`)
      );

    classes.borderWidth.forEach((bW) => {
      if (cls.indexOf(`${getResponsivePrefix(responsiveView)}${bW}`) !== -1)
        borderWidth = `${getResponsivePrefix(responsiveView)}${bW}`;
    });

    classes.borderStyle.forEach((bS) => {
      if (cls.indexOf(`${getResponsivePrefix(responsiveView)}${bS}`) !== -1)
        borderStyle = `${getResponsivePrefix(responsiveView)}${bS}`;
    });

    classes[getClassName(resultNode?.className)].forEach((bC) => {
      if (cls.indexOf(`${getResponsivePrefix(responsiveView)}${bC}`) !== -1)
        borderColor = `${getResponsivePrefix(responsiveView)}${bC}`;
    });

    return {
      borderWidth: borderWidth,
      borderStyle: borderStyle,
      borderColor: borderColor,
    };
  } else {
    return {};
  }
};

export const useClassNames = () => {
  const { dom } = useSelector((state) => state.data);
  const { previousClassNames } = useSelector((state) => state.classes);
  let classNames = [];

  const checkEndReturnNode = (node) => {
    node.className?.split(" ").forEach((elm) => {
      if (classNames.indexOf(elm) === -1) classNames.push(elm);
    });

    if (node.children) {
      node.children.forEach((n) => {
        checkEndReturnNode(n);
      });
    }
  };

  checkEndReturnNode(dom[0]);

  if (JSON.stringify(classNames) !== JSON.stringify(previousClassNames)) {
    return { classNames };
  } else {
    return {};
  }
};



================================================
FILE: src/redux/classes-reducer.js
================================================
const SET_PREVIOUS_CLASSNAMES = "classes-reducer/SET_PREVIOUS_CLASSNAMES";

const initialState = {
  previousClassNames: [],
};

const classesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PREVIOUS_CLASSNAMES: {
      return { ...state, previousClassNames: action.data };
    }
    default:
      return state;
  }
};

const actions = {
  setPreviousClassNames: (data) => ({
    type: SET_PREVIOUS_CLASSNAMES,
    data: data,
  }),
};

export const setPreviousClassNames = (data) => (dispatch) => {
  dispatch(actions.setPreviousClassNames(data));
};

export default classesReducer;



================================================
FILE: src/redux/data-reducer.js
================================================
import { htmlToJson, replceSpecialCharacters } from "../utils";

const SET_CONFIG = "data-reducer/SET_CONFIG";
const SET_DOM = "data-reducer/SET_DOM";
const SET_ERROR = "data-reducer/SET_ERROR";
const SET_SELECTED_SECTION = "data-reducer/SET_SELECTED_SECTION";
const SET_HOVERED_SECTION = "data-reducer/SET_HOVERED_SECTION";
const MOVE_NODE = "data-reducer/MOVE_NODE";
const ADD_TO_DOM = "data-reducer/ADD_TO_DOM";
const REPLACE_DOM = "data-reducer/REPLACE_DOM";
const REMOVE_NODE = "data-reducer/REMOVE_NODE";
const UPDATE_TEXT = "data-reducer/UPDATE_TEXT";
const SET_HIGHLIGHT = "data-reducer/SET_HIGHLIGHT";
const SET_ATTRIBUTE = "data-reducer/SET_ATTRIBUTE";
const SET_BACKWARD = "data-reducer/SET_BACKWARD";
const SET_FORWARD = "data-reducer/SET_FORWARD";
const SET_HIGHLIGHT_LAYER = "data-reducer/SET_HIGHLIGHT_LAYER";
const SET_HOVERED_LAYER = "data-reducer/SET_HOVERED_LAYER";
const SET_SELECTED_PARENT = "data-reducer/SET_SELECTED_PARENT";
const SET_SELECTED_CHILD = "data-reducer/SET_SELECTED_CHILD";
const ADD_IMAGE = "data-reducer/ADD_IMAGE";
const SET_ENABLE_REMOVE = "data-reducer/SET_ENABLE_REMOVE";
const SET_IS_SAVING = "data-reducer/SET_IS_SAVING";

const initialState = {
  config: null,
  dom: [
    {
      id: "C2BsOHNi-z",
      tagName: "body",
      label: "Body",
      className: "h-full",
      children: [
        {
          id: "i0gs1N0-f3",
          tagName: "div",
          className: "container mx-auto",
          label: "Container",
          children: [
            {
              id: "C2BOHNi-z",
              tagName: "div",
            },
            {
              id: "i0g1N0-f3",
              tagName: "section",
              children: [],
            },
            {
              id: "WA0tV0TP4",
              tagName: "div",
              className: "grid gap-x-4 gap-y-4 grid-cols-1 md:grid-cols-2",
              label: "Columns 3",
              children: [
                {
                  id: "lCWQLK7tX0",
                  tagName: "div",
                  className: "p-3 lg:mt-0 md:mt-10",
                  children: [
                    {
                      id: "AFxhldq2O2",
                      tagName: "span",
                      isClosed: true,
                      content: "1",
                    },
                  ],
                },
                {
                  id: "UNQNaXsjPl",
                  tagName: "div",
                  className: "p-3",
                  children: [
                    {
                      id: "IMzpPdaPh8",
                      tagName: "span",
                      isClosed: true,
                      content: "2",
                    },
                  ],
                },
                {
                  id: "FnDTXhKNLM",
                  tagName: "div",
                  className: "p-3",
                  children: [
                    {
                      id: "LX2vTs_Q7R",
                      tagName: "span",
                      isClosed: true,
                      content: "3",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  selectedSection: null,
  hoveredSection: null,
  dropHighlight: null,
  error: null,
  past: [],
  future: [],
  dropHighlightLayer: null,
  hoveredLayer: null,
  mediaLibrary: [],
  enableRemove: true,
  isSaving: false,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIG: {
      return { ...state, config: action.data };
    }
    case SET_DOM: {
      return {
        ...state,
        dom: action.data,
        past: [...state.past, state.dom],
      };
    }
    case MOVE_NODE: {
      return {
        ...state,
        dom: action.data,
        past: [...state.past, state.dom],
      };
    }
    case ADD_TO_DOM: {
      return {
        ...state,
        dom: [
          {
            ...state.dom[0],
            children: [...state.dom[0].children, action.data],
          },
        ],
        past: [...state.past, state.dom],
      };
    }
    case REPLACE_DOM: {
      return {
        ...state,
        dom: [
          {
            ...action.data,
          },
        ],
        past: [...state.past, state.dom],
      };
    }
    case SET_SELECTED_SECTION: {
      return { ...state, selectedSection: action.data };
    }
    case SET_ERROR: {
      return { ...state, error: action.data };
    }
    case SET_HOVERED_SECTION: {
      return { ...state, hoveredSection: action.data };
    }
    case REMOVE_NODE: {
      return {
        ...state,
        dom: action.data,
        past: [...state.past, state.dom],
      };
    }
    case UPDATE_TEXT: {
      return {
        ...state,
        dom: action.data,
        past: [...state.past, state.dom],
      };
    }
    case SET_HIGHLIGHT: {
      return { ...state, dropHighlight: action.data };
    }
    case SET_ATTRIBUTE: {
      return {
        ...state,
        dom: action.data,
        past: [...state.past, state.dom],
      };
    }
    case SET_BACKWARD: {
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        ...state,
        ...(previous
          ? {
              past: newPast,
              dom: previous,
              future: [state.dom, ...state.future],
            }
          : {}),
      };
    }
    case SET_FORWARD: {
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        ...(next
          ? {
              past: [...state.past, state.dom],
              dom: next,
              future: newFuture,
            }
          : {}),
      };
    }
    case SET_HIGHLIGHT_LAYER: {
      return { ...state, dropHighlightLayer: action.data };
    }
    case SET_HOVERED_LAYER: {
      return { ...state, hoveredLayer: action.data };
    }
    case SET_SELECTED_PARENT: {
      return { ...state, selectedSection: action.data };
    }
    case SET_SELECTED_CHILD: {
      return { ...state, selectedSection: action.data };
    }
    case ADD_IMAGE: {
      return { ...state, mediaLibrary: [...state.mediaLibrary, action.data] };
    }
    case SET_ENABLE_REMOVE: {
      return { ...state, enableRemove: action.data };
    }
    case SET_IS_SAVING: {
      return { ...state, isSaving: action.data };
    }
    default:
      return state;
  }
};

const actions = {
  setConfig: (data) => ({
    type: SET_CONFIG,
    data: data,
  }),
  setDom: (data) => ({
    type: SET_DOM,
    data: data,
  }),
  setSelectedSection: (data) => ({
    type: SET_SELECTED_SECTION,
    data: data,
  }),
  moveNode: (data) => ({
    type: MOVE_NODE,
    data: data,
  }),
  addToDom: (data) => ({
    type: ADD_TO_DOM,
    data: data,
  }),
  replaceDom: (data) => ({
    type: REPLACE_DOM,
    data: data,
  }),
  setHoveredSection: (data) => ({
    type: SET_HOVERED_SECTION,
    data: data,
  }),
  removeNode: (data) => ({
    type: REMOVE_NODE,
    data: data,
  }),
  updateText: (data) => ({
    type: UPDATE_TEXT,
    data: data,
  }),
  setHighlight: (data) => ({
    type: SET_HIGHLIGHT,
    data: data,
  }),
  setAttribute: (data) => ({
    type: SET_ATTRIBUTE,
    data: data,
  }),
  setError: (data) => ({
    type: SET_ERROR,
    data: data,
  }),
  setBackward: (data) => ({
    type: SET_BACKWARD,
    data: data,
  }),
  setForward: (data) => ({
    type: SET_FORWARD,
    data: data,
  }),
  setHighlightLayer: (data) => ({
    type: SET_HIGHLIGHT_LAYER,
    data: data,
  }),
  setHoveredLayer: (data) => ({
    type: SET_HOVERED_LAYER,
    data: data,
  }),
  setSelectedParent: (data) => ({
    type: SET_SELECTED_PARENT,
    data: data,
  }),
  setSelectedChild: (data) => ({
    type: SET_SELECTED_CHILD,
    data: data,
  }),
  addImage: (data) => ({
    type: ADD_IMAGE,
    data: data,
  }),
  setEnableRemove: (data) => ({
    type: SET_ENABLE_REMOVE,
    data: data,
  }),
  setIsSaving: (data) => ({
    type: SET_IS_SAVING,
    data: data,
  }),
};

export const setError = (err) => (dispatch) => {
  dispatch(actions.setError(err));
};

export const setHighlight = (err) => (dispatch) => {
  dispatch(actions.setHighlight(err));
};

export const setHighlightLayer = (err) => (dispatch) => {
  dispatch(actions.setHighlightLayer(err));
};

export const setHoveredLayer = (err) => (dispatch) => {
  dispatch(actions.setHoveredLayer(err));
};

export const moveNode = (dragId, hoverId, type) => (dispatch, getState) => {
  const {
    data: {
      dom,
      hoveredSection,
      hoveredLayer,
      dropHighlight,
      dropHighlightLayer,
    },
  } = getState();

  const section = type === "layer" ? hoveredLayer : hoveredSection;
  const highlight = type === "layer" ? dropHighlightLayer : dropHighlight;
  let newDom = [...removeNodeInternal(dom, section.id)];
  let added = false;

  const checkEndReturnNode = (nx) => {
    let newNode = { ...nx };

    if (nx.children) {
      nx.children.forEach((n, i) => {
        if (n.id === hoverId) {
          if (n.id === highlight?.id) {
            if (highlight.position === "all")
              newNode.children[i].children.push(section);
            if (highlight.position === "top" || highlight.position === "left") {
              const index = newNode.children.findIndex(
                (c) => c.id === highlight.id
              );
              if (!added) newNode.children.splice(index, 0, section).join();
              added = true;
            }

            if (
              highlight.position === "bottom" ||
              highlight.position === "right"
            ) {
              const index = newNode.children.findIndex(
                (c) => c.id === highlight.id
              );
              if (!added) newNode.children.splice(index + 1, 0, section).join();
              added = true;
            }
          }
        } else {
          checkEndReturnNode(n);
        }
      });
    }

    return newNode;
  };

  if (!checkIfChild(section.children, hoverId)) {
    newDom.forEach((ny, i) => {
      if (ny.id === hoverId) {
        if (ny.id === highlight.id) {
          if (highlight.position === "all") {
            newDom[i].children.push(section);
          }
          if (highlight.position === "top" || highlight.position === "left") {
            const index = newDom.findIndex((c) => c.id === highlight.id);
            if (!added) newDom.splice(index, 0, section).join();
            added = true;
          }

          if (
            highlight.position === "bottom" ||
            highlight.position === "right"
          ) {
            const index = newDom.findIndex((c) => c.id === highlight.id);
            if (!added) newDom.splice(index + 1, 0, section).join();
            added = true;
          }
        }
      } else {
        if (!added) newDom[i] = checkEndReturnNode(ny);
      }
    });

    dispatch(actions.moveNode(newDom));
  }
};

export const setDom = (data) => (dispatch) => {
  dispatch(actions.setDom(data));
};

export const setHoveredSection = (data) => (dispatch) => {
  dispatch(actions.setHoveredSection(data));
};

export const addToDom = (data) => (dispatch) => {
  const doc = new DOMParser().parseFromString(
    replceSpecialCharacters(data.content),
    "text/xml"
  );

  dispatch(
    actions.addToDom(htmlToJson(doc.firstChild, data.attributes, data.label))
  );
};

export const replaceDom = (data) => (dispatch) => {
  const doc = new DOMParser().parseFromString(
    replceSpecialCharacters(data.content),
    "text/xml"
  );

  dispatch(
    actions.replaceDom(htmlToJson(doc.firstChild, data.attributes, data.label))
  );
};

export const addToNode = (data, id) => (dispatch, getState) => {
  let added = false;

  const {
    data: { dom, dropHighlight },
  } = getState();

  let newDom = [...dom];

  const checkEndReturnNode = (nx) => {
    let newNode = { ...nx };

    if (nx.children) {
      nx.children.forEach((n, i) => {
        if (n.id === id) {
          if (n.id === dropHighlight.id) {
            if (dropHighlight.position === "all")
              newNode.children[i].children
                ? newNode.children[i].children.push(data)
                : (newNode.children[i].children = [data]);
            if (
              dropHighlight.position === "top" ||
              dropHighlight.position === "left"
            ) {
              const index = newNode.children.findIndex(
                (c) => c.id === dropHighlight.id
              );
              if (!added) newNode.children.splice(index, 0, data).join();
              added = true;
            }

            if (
              dropHighlight.position === "bottom" ||
              dropHighlight.position === "right"
            ) {
              const index = newNode.children.findIndex(
                (c) => c.id === dropHighlight.id
              );
              if (!added) newNode.children.splice(index + 1, 0, data).join();
              added = true;
            }
          }
        } else {
          checkEndReturnNode(n);
        }
      });
    }

    return newNode;
  };

  dom.forEach((ny, i) => {
    if (ny.id === id) {
      if (ny.id === dropHighlight.id) {
        if (dropHighlight.position === "all") {
          newDom[i].children
            ? newDom[i].children.push(data)
            : (newDom[i].children = [data]);
        }
        if (
          dropHighlight.position === "top" ||
          dropHighlight.position === "left"
        ) {
          const index = newDom.findIndex((c) => c.id === dropHighlight.id);
          if (!added) newDom.splice(index, 0, data).join();
          added = true;
        }

        if (
          dropHighlight.position === "bottom" ||
          dropHighlight.position === "right"
        ) {
          const index = newDom.findIndex((c) => c.id === dropHighlight.id);
          if (!added) newDom.splice(index + 1, 0, data).join();
          added = true;
        }
      }
    } else {
      if (!added) newDom[i] = checkEndReturnNode(ny);
    }
  });

  dispatch(actions.setDom(newDom));
};

export const setConfig = (data) => (dispatch) => {
  dispatch(actions.setConfig(data));
};

export const setSelectedSection = (data) => (dispatch) => {
  dispatch(actions.setSelectedSection(data));
};

export const removeNode = (id) => (dispatch, getState) => {
  const {
    data: { dom, selectedSection, enableRemove },
  } = getState();

  if (enableRemove)
    dispatch(
      actions.removeNode(removeNodeInternal(dom, id ? id : selectedSection.id))
    );
};

export const updateText = (id, text) => (dispatch, getState) => {
  let newDom = [];
  const {
    data: { dom },
  } = getState();

  const checkEndReturnNode = (node) => {
    let newNode = { ...node };

    if (node.children) {
      newNode.children = [];

      node.children.forEach((n) => {
        n.id === id
          ? newNode.children.push({ ...n, content: text })
          : newNode.children.push(checkEndReturnNode(n));
      });
    }

    return newNode;
  };

  dom.forEach((node) => {
    node.id === id
      ? newDom.push({ ...node, content: text })
      : newDom.push(checkEndReturnNode(node));
  });

  dispatch(actions.updateText(newDom));
};

export const setAttribute = (attributeName, value) => (dispatch, getState) => {
  let newDom = [];
  const {
    data: { dom, selectedSection },
  } = getState();
  const id = selectedSection.id;

  const checkEndReturnNode = (node) => {
    let newNode = { ...node };

    if (node.children) {
      newNode.children = [];

      node.children.forEach((n) => {
        n.id === id
          ? newNode.children.push({ ...n, [attributeName]: value })
          : newNode.children.push(checkEndReturnNode(n));
      });
    }

    return newNode;
  };

  dom.forEach((node) => {
    node.id === id
      ? newDom.push({ ...node, [attributeName]: value })
      : newDom.push(checkEndReturnNode(node));
  });

  dispatch(actions.setAttribute(newDom));
};

export const setIsHiden = (id, value) => (dispatch, getState) => {
  let newDom = [];
  const {
    data: { dom },
  } = getState();

  const checkEndReturnNode = (node) => {
    let newNode = { ...node };

    if (node.children) {
      newNode.children = [];

      node.children.forEach((n) => {
        n.id === id
          ? newNode.children.push({ ...n, isHidden: value })
          : newNode.children.push(checkEndReturnNode(n));
      });
    }

    return newNode;
  };

  dom.forEach((node) => {
    node.id === id
      ? newDom.push({ ...node, isHidden: value })
      : newDom.push(checkEndReturnNode(node));
  });

  dispatch(actions.setAttribute(newDom));
};

export const setSelectedParent = (id) => (dispatch, getState) => {
  const {
    data: { dom },
  } = getState();

  const checkNode = (node) => {
    if (node.children) {
      node.children.forEach((n) => {
        if (n.id === id) console.log(node);
        n.id === id ? dispatch(actions.setSelectedParent(node)) : checkNode(n);
      });
    }
  };

  dom.forEach((node) => checkNode(node));
};

export const setSelectedChild = (id) => (dispatch, getState) => {
  const {
    data: { dom },
  } = getState();

  const checkNode = (node) => {
    if (node.children) {
      node.children.forEach((n) => {
        n.id === id
          ? dispatch(
              actions.setSelectedParent(
                n.children?.length > 0 ? n.children[0] : n
              )
            )
          : checkNode(n);
      });
    }
  };

  dom.forEach((node) => checkNode(node));
};

export const save = (data) => (dispatch, getState) => {
  const {
    data: { dom, config },
  } = getState();

  if (config?.apiURL) {
    dispatch(actions.setIsSaving(true));

    fetch(`${config.apiURL}/save`, {
      method: "POST",
      body: JSON.stringify({ dom: dom }),
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(actions.setIsSaving(false));
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const removeNodeInternal = (dom, id) => {
  let newDom = [];

  const checkEndReturnNode = (node) => {
    let newNode = { ...node };
    newNode.children = [];

    if (node.children)
      node.children.forEach((n) => {
        if (n.id !== id) newNode.children.push(checkEndReturnNode(n));
      });

    return newNode;
  };

  dom.forEach((node) => {
    if (node.id !== id) newDom.push(checkEndReturnNode(node));
  });

  return newDom;
};

const checkIfChild = (dom, id) => {
  let isContains = false;

  const checkEndReturnNode = (node) => {
    if (node.children)
      node.children.forEach((n) => {
        n.id !== id ? checkEndReturnNode(n) : (isContains = true);
      });
  };

  dom?.forEach((node) => {
    node.id !== id ? checkEndReturnNode(node) : (isContains = true);
  });

  return isContains;
};

export const setBackward = (data) => (dispatch) => {
  dispatch(actions.setBackward(data));
};

export const setForward = (data) => (dispatch) => {
  dispatch(actions.setForward(data));
};

export const addImage = (data) => (dispatch) => {
  dispatch(actions.addImage(data));
};

export const setEnableRemove = (data) => (dispatch) => {
  dispatch(actions.setEnableRemove(data));
};

export const setIsSaving = (data) => (dispatch) => {
  dispatch(actions.setIsSaving(data));
};

export default dataReducer;



================================================
FILE: src/redux/layout-reducer.js
================================================
const SET_ACTIVE_TAB = "layout-reducer/SET_ACTIVE_TAB";
const SET_RESPONSIVE_VIEW = "layout-reducer/SET_RESPONSIVE_VIEW";
const SET_IS_PREVIEW = "layout-reducer/SET_IS_PREVIEW";

const initialState = {
  activeTab: "style-manager",
  responsiveView: "sm",
  isPreview: false,
};

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB: {
      return { ...state, activeTab: action.data };
    }
    case SET_RESPONSIVE_VIEW: {
      return { ...state, responsiveView: action.data };
    }
    case SET_IS_PREVIEW: {
      return { ...state, isPreview: action.data };
    }
    default:
      return state;
  }
};

const actions = {
  setActiveTab: (data) => ({
    type: SET_ACTIVE_TAB,
    data: data,
  }),
  setResponsiveView: (data) => ({
    type: SET_RESPONSIVE_VIEW,
    data: data,
  }),
  setIsPreview: (data) => ({
    type: SET_IS_PREVIEW,
    data: data,
  }),
};

export const setActiveTab = (data) => (dispatch) => {
  dispatch(actions.setActiveTab(data));
};

export const setResponsiveView = (data) => (dispatch) => {
  dispatch(actions.setResponsiveView(data));
};

export const setIsPreview = (data) => (dispatch) => {
  dispatch(actions.setIsPreview(data));
};

export default layoutReducer;



================================================
FILE: src/redux/modals-reducer.js
================================================
const OPEN_MODAL_MEDIA_LIBRARY = "modals-reducer/OPEN_MODAL_MEDIA_LIBRARY";
const CLOSE_MODAL_MEDIA_LIBRARY = "modals-reducer/CLOSE_MODAL_MEDIA_LIBRARY";
const CLOSE_ALL_MODALS = "modals-reducer/CLOSE_ALL_MODALS";
const OPEN_MODAL_EXPORT = "modals-reducer/OPEN_MODAL_EXPORT";
const CLOSE_MODAL_EXPORT = "modals-reducer/CLOSE_MODAL_EXPORT";
const CLOSE_MODAL_AI = "modals-reducer/CLOSE_MODAL_AI";
const OPEN_MODAL_AI = "modals-reducer/OPEN_MODAL_AI";
const OPEN_MODAL_IMAGE_SOURCE = "modals-reducer/OPEN_MODAL_IMAGE_SOURCE";
const CLOSE_MODAL_IMAGE_SOURCE = "modals-reducer/CLOSE_MODAL_IMAGE_SOURCE";
const OPEN_MODAL_IMPORT = "modals-reducer/OPEN_MODAL_IMPORT";
const CLOSE_MODAL_IMPORT = "modals-reducer/CLOSE_MODAL_IMPORT";

const initialState = {
  data: {},
  isMediaLibrary: false,
  isExport: false,
  isAI: false,
  isImageSource: false,
  isImport: false,
  mediaRequestFrom: "",
};

const modalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL_MEDIA_LIBRARY: {
      return { ...state, isMediaLibrary: true, mediaRequestFrom: action.data };
    }
    case CLOSE_MODAL_MEDIA_LIBRARY: {
      return { ...state, isMediaLibrary: false, mediaRequestFrom: "" };
    }
    case OPEN_MODAL_EXPORT: {
      return { ...state, isExport: true };
    }
    case CLOSE_MODAL_EXPORT: {
      return { ...state, isExport: false };
    }
    case OPEN_MODAL_AI: {
      return { ...state, isAI: true, data: action.data };
    }
    case CLOSE_MODAL_AI: {
      return { ...state, isAI: false, data: {} };
    }
    case OPEN_MODAL_IMAGE_SOURCE: {
      return { ...state, isImageSource: true };
    }
    case CLOSE_MODAL_IMAGE_SOURCE: {
      return { ...state, isImageSource: false };
    }
    case OPEN_MODAL_IMPORT: {
      return { ...state, isImport: true };
    }
    case CLOSE_MODAL_IMPORT: {
      return { ...state, isImport: false };
    }
    case CLOSE_ALL_MODALS: {
      return { ...state, ...initialState };
    }
    default:
      return state;
  }
};

const actions = {
  openModal: (modalName, data) => {
    switch (modalName) {
      case "mediaLibrary":
        return {
          type: OPEN_MODAL_MEDIA_LIBRARY,
          data: data,
        };
      case "export":
        return {
          type: OPEN_MODAL_EXPORT,
          data: data,
        };
      case "AI":
        return {
          type: OPEN_MODAL_AI,
          data: data,
        };
      case "imageSource":
        return {
          type: OPEN_MODAL_IMAGE_SOURCE,
          data: data,
        };
      case "import":
        return {
          type: OPEN_MODAL_IMPORT,
          data: data,
        };
    }
  },
  closeModal: (modalName) => {
    switch (modalName) {
      case "mediaLibrary":
        return {
          type: CLOSE_MODAL_MEDIA_LIBRARY,
        };
      case "export":
        return {
          type: CLOSE_MODAL_EXPORT,
        };
      case "AI":
        return {
          type: CLOSE_MODAL_AI,
        };
      case "imageSource":
        return {
          type: CLOSE_MODAL_IMAGE_SOURCE,
        };
      case "import":
        return {
          type: CLOSE_MODAL_IMPORT,
        };
    }
  },
  closeAllModals: () => ({
    type: CLOSE_ALL_MODALS,
  }),
};

export const openModal = (modalName, data) => (dispatch) => {
  dispatch(actions.openModal(modalName, data));
};

export const closeModal = (modalName) => (dispatch) => {
  dispatch(actions.closeModal(modalName));
};

export const closeAllModals = () => (dispatch) => {
  dispatch(actions.closeAllModals());
};

export default modalsReducer;



================================================
FILE: src/redux/store.js
================================================
import {applyMiddleware, combineReducers, createStore,} from "redux"
import thunkMiddleWare from "redux-thunk"
import modalsReducer from "./modals-reducer"
import dataReducer from "./data-reducer"
import layoutReducer from "./layout-reducer"
import classesReducer from "./classes-reducer"

const reducers = combineReducers(
    {
        modals: modalsReducer,
        data: dataReducer,
        layout: layoutReducer,
        classes: classesReducer
    }
);

export const store = createStore(reducers, applyMiddleware(thunkMiddleWare));


================================================
FILE: src/render/template.js
================================================
export const htmlTemplate = `<!DOCTYPE html>
<html lang='en-US'>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="icon" type="image/x-icon" href="/assets/img/favicon.ico">
  <title>{Title}</title>

  <style>
    {Styles}
  </style>

</head>

{Body}


</html>
`


================================================
FILE: src/styles/classes.js
================================================
export const button = "bg-slate-600 rounded text-slate-300 hover:bg-slate-700 hover:text-slate-200 transition flex justify-center p-2"
export const tab = "uppercase mr-6 border-b-4 transition-all hover:text-slate-200 transition flex justify-center py-2"
export const buttonSimple = "inline-flex ml-3 bg-slate-500 hover:bg-slate-700 text-white transition py-2 px-4 rounded focus:outline-none focus:shadow-outline"


================================================
FILE: src/styles/index.css
================================================
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  width: 100vw;
  overflow: hidden;
  height: 100vh;
}


================================================
FILE: src/styles/mediumTheme.js
================================================
const styles = `
.medium-toolbar-arrow-under:after {
  border-color: #1e293b transparent transparent;
  top: 34px;
}
.medium-toolbar-arrow-over:before {
  border-color: transparent transparent #1e293b;
  top: -8px;
}
.medium-editor-toolbar {
  background-color: #1e293b;
  background: -webkit-linear-gradient(top, #1e293b, rgba(36, 36, 36, 0.75));
  background: linear-gradient(to bottom, #1e293b, rgba(36, 36, 36, 0.75));
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 0 0 3px #1e293b;
}
.medium-editor-toolbar li button {
  background-color: #1e293b;
  padding: 8px !important;
  background: -webkit-linear-gradient(top, #475569, #1e293b);
  background: linear-gradient(to bottom, #475569, #1e293b);
  border: 0;
  border-right: 1px solid #000;
  border-left: 1px solid #333;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  color: #fff;
  height: 34px;
  min-width: 34px;
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}
.medium-editor-toolbar li button:hover {
  background-color: #000;
  color: rgba(255,255,255,0.5);
}
.medium-editor-toolbar li .medium-editor-button-first {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
.medium-editor-toolbar li .medium-editor-button-last {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}
.medium-editor-toolbar li .medium-editor-button-active {
  background-color: #000;
  background: -webkit-linear-gradient(top, #1e293b, #1e293b);
  background: linear-gradient(to bottom, #1e293b, #1e293b);
  color: #fff;
}
.medium-editor-toolbar-form {
  background: #1e293b;
  border-radius: 5px;
  color: #999;
}
.medium-editor-toolbar-form .medium-editor-toolbar-input {
  background: #1e293b;
  box-sizing: border-box;
  color: #ccc;
  height: 34px;
}
.medium-editor-toolbar-form a {
  color: #fff;
  font-size: 18px !important;
}
.medium-editor-toolbar-anchor-preview {
  background: #1e293b;
  border-radius: 5px;
  color: #fff;
}
.medium-editor-placeholder:after {
  color: #1e293b;
}
`;

export default styles;



================================================
FILE: src/styles/variables.scss
================================================
$header-height: 50px;
$sidebar-width: 300px;
$breadcrumb-height: 40px;

$button-sm: 44px;
$button-md: 56px;
$button-lg: 64px;

$button-block-height: 100px;

$transition: 300ms;

$gutter: 15px;

$container-width: 1440px;

$modal-width: 800px;

$white: #ffffff;
$black: #272727;
$light: #e2e8f0;


================================================
FILE: src/utils/index.js
================================================
import shortid from "shortid";

export const closedTags = [
  "span",
  "p",
  "i",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "blockquote",
];

export const htmlToJson = (node, attributes, label) => {
  const id = shortid.generate();
  let tag = {};
  tag["id"] = id;
  tag["tagName"] = node.tagName;
  if (label) tag["label"] = label;
  tag["children"] = [];

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      tag[key === "class" ? "className" : key] = attributes[key];
    });
  }

  if (closedTags.indexOf(node.tagName) >= 0) tag["isClosed"] = true;

  if (
    (node.innerHTML && !node.innerHTML.includes("<")) ||
    node.tagName === "span"
  ) {
    tag.content = node.textContent;
  } else {
    for (let i = 0; i < node.children.length; i++) {
      tag["children"].push(htmlToJson(node.children[i]));
    }
  }

  for (let i = 0; i < node.attributes.length; i++) {
    let attr = node.attributes[i];
    tag[attr.name === "class" ? "className" : attr.name] = attr.value;
  }
  return tag;
};

export const clearClassNames = (current, exclude) => {
  let result = current;

  if (result) {
    result = result
      .split(" ")
      .filter((c) => exclude.indexOf(c) === -1)
      .join(" ");
  }

  return result;
};

export const clearShadowClassNames = (current, prefix) => {
  let result = current;

  if (result) {
    result = result
      .split(" ")
      .filter((c) => c.indexOf(`${prefix}shadow-[`) !== 0)
      .join(" ");
  }

  return result;
};

export const getWordBoundsAtPosition = (str, position) => {
  const isSpace = (c) => /\s/.exec(c);
  let start = position - 1;
  let end = position;

  while (start >= 0 && !isSpace(str[start])) {
    start -= 1;
  }
  start = Math.max(0, start + 1);

  while (end < str.length && !isSpace(str[end])) {
    end += 1;
  }
  end = Math.max(start, end);

  return [start, end];
};

export const getDefaultDisplayClass = (tag) => {
  switch (tag) {
    case "span":
      return "inline";
    case "button":
      return "inline-block";
    default:
      return "block";
  }
};

export const getDefaultDisplayClassEditable = (tag) => {
  switch (tag) {
    case "span":
    case "button":
      return "inline-block";
    default:
      return "block";
  }
};

export const rgba2hex = (rgba) => {
  const [red, green, blue, alpha] = rgba.match(/[\d.]+/g);
  const color = `#${Number(red).toString(16).padStart(2, "0")}${Number(green)
    .toString(16)
    .padStart(2, "0")}${Number(blue).toString(16).padStart(2, "0")}`;
  const opacity = parseFloat(alpha);

  return {
    color: color,
    opacity: opacity,
  };
};

export const getColorNameByValue = (colors, value) => {
  let result = null;
  Object.keys(colors).forEach((ck) => {
    if (typeof colors[ck] === "string") {
      if (colors[ck] === value) result = ck;
    } else {
      Object.keys(colors[ck]).forEach((zk) => {
        if (colors[ck][zk] === value) result = `${ck}-${zk}`;
      });
    }
  });

  return result;
};

export const addStyle = (css) => {
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
};

export const getClassByPartOfName = (className, partOfName) => {
  let result = null;

  className?.split(" ").map((c) => {
    if (c.indexOf(partOfName) === 0) result = c;
  });

  return result;
};

export const clearClassNamesByPartOfName = (className, partOfName) =>
  className
    ?.split(" ")
    .filter((c) => c.indexOf(partOfName) !== 0)
    .join(" ");

export const checkAndReturnStyles = (node) => {
  const regex = /([\w-]*)\s*:\s*([^;]*)/g;
  let match,
    properties = {};
  while ((match = regex.exec(node.style)))
    properties[match[1]] = match[2].trim();

  return properties;
};

export const getResponsivePrefix = (view) => {
  switch (view) {
    case "xl":
      return "xl:";
    case "lg":
      return "lg:";
    case "md":
      return "md:";
    case "sm":
      return "";
  }
};

export const getResponsivePrefixes = (view) => {
  switch (view) {
    case "xl":
      return ["xl:", "lg:", "md:", ""];
    case "lg":
      return ["lg:", "md:", ""];
    case "md":
      return ["md:", ""];
    case "sm":
      return [""];
  }
};

export const isCanContainsChildren = (name) => {
  switch (name) {
    case "hr":
    case "img":
    case "input":
    case "li":
      return false;
    default:
      return true;
  }
};

export const getEditableTagName = (tagName) => {
  switch (tagName) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "li":
      return "li";
    case "p":
      return "p";
    default:
      return "span";
  }
};

export const getMoreTags = (tagName) => {
  switch (tagName) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return ["h1", "h2", "h3", "h4", "h5", "h6"];
    default:
      return [];
  }
};

export const isTagVariants = (tagName) => {
  switch (tagName) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return true;
    default:
      return false;
  }
};

export const replceSpecialCharacters = (string) => {
  const replaceChar = [
    { reg: "&", replace: "&amp;" },
    { reg: "£", replace: "&pound;" },
    { reg: "€", replace: "&euro;" },
    { reg: "é", replace: "&eacute;" },
    { reg: "–", replace: "&ndash;" },
    { reg: "®", replace: "&reg;" },
    { reg: "™", replace: "&trade;" },
    { reg: "‘", replace: "&lsquo;" },
    { reg: "’", replace: "&rsquo;" },
    { reg: "“", replace: "&ldquo;" },
    { reg: "”", replace: "&rdquo;" },
    { reg: "#", replace: "&#35;" },
    { reg: "©", replace: "&copy;" },
    { reg: "@", replace: "&commat;" },
    { reg: "$", replace: "&dollar;" },
    { reg: "\\(", replace: "&#40;" },
    { reg: "\\)", replace: "&#41;" },
    { reg: "…", replace: "&hellip;" },
    { reg: "-", replace: "&#45;" },
    { reg: "\\*", replace: "&#42;" },
    { reg: "required", replace: 'required="true"' },
    //{ reg: new RegExp(`\\brequired\\b`, "g"), replace: 'required="true"' },
  ];
  let s = string;
  replaceChar.forEach((obj) => {
    s = s.replaceAll(obj.reg, obj.replace);
  });

  return s;
};

export const toBase64 = (file) =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

export const clearHTML = (html) => {
  if(html.search("</body>")) {
    const result = html.match(
      /\<body(.+?)\<\/body\>/g
    );

    return result[0]
  }else {
    return html
  }
}
