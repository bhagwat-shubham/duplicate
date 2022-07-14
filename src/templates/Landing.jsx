import React from 'react';

import { Meta } from '../layout/Meta';
import { Config } from '../utils/Config';
import { Banner } from './Banner';
import { DemoMenu } from './DemoMenu';
import { Footer } from './Footer';
import { Hero } from './Hero';

const Landing = () => (
  <div className="antialiased text-gray-600">
    <Meta title={Config.title} description={Config.description} />
    <Hero />
    {/* <VerticalFeatures /> */}
    <DemoMenu />
    <Banner />
    <Footer />
  </div>
);

export { Landing };
