import React from "react";
import { Tab, Tabs, TabList } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CityCapital from "./components/CityCapital";
import TextToImageModel from "./components/TextToImageModel";

const App = () => (
  <Tabs>
    <TabList>
      <Tab>
        <h3>City Capital</h3>
        <CityCapital />
      </Tab>
      <Tab>
        <h3>Text to Image Model</h3>
        <TextToImageModel />
      </Tab>
    </TabList>
  </Tabs>
);

export default App;
