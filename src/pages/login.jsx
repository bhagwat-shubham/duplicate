import React from "react";
import { Meta } from "../layout/Meta";
import { Section } from "../layout/Section";
import { Footer } from "../templates/Footer";
import { Hero } from "../templates/Hero";
import { Config } from "../utils/Config";

const Index = () => (
  <div className="antialiased text-gray-600">
    <Meta title={Config.title} description={Config.description} />
    <Hero />

    <Section
      title="Document AI Demos for Public Sector"
      description="Log in with Google Account"
    >
      <div>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-8 rounded inline-flex items-center">
          <span>Log In</span>
        </button>
      </div>
    </Section>
    <Footer />
  </div>
);

export default Index;
