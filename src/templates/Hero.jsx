import React from "react";
// import Button from "react-bootstrap/Button";
import { Background } from "../background/Background";
import { Section } from "../layout/Section";
import { NavbarTwoColumns } from "../navigation/NavbarTwoColumns";
import { Logo } from "./Logo";

const Hero = () => (
  <Background color="bg-gray-100 ">
    <Section yPadding="py-0 ">
      <NavbarTwoColumns logo={<Logo xl />}></NavbarTwoColumns>
    </Section>

    {/* <Section yPadding="pt-20 pb-32 hidden">
      <HeroOneButton
        title={(
          <>
            {'The modern landing page for\n'}
            <span className="text-primary-500">React developer</span>
          </>
        )}
        description="The easiest way to build React landing page in seconds."
        button={(
          <Link href="https://creativedesignsguru.com/category/nextjs/">
            <a>
              <Button xl>Download Your Free Theme</Button>
            </a>
          </Link>
        )}
      />
    </Section> */}
  </Background>
);

export { Hero };
