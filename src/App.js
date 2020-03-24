import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { ScreenSpinner } from "@vkontakte/vkui";

import "@vkontakte/vkui/dist/vkui.css";

import "@vkontakte/vkui/dist/vkui.css";

import Main from "./panels/Main";
import { store } from "./user/store";

const App = () => {
  return <Main id="main" />;
};

export default App;
