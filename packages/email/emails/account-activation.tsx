import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type TActivationEmail = {
  accountActivationLink: string;
  name: string;
};

export const AcoountActivationEmail = ({
  name,
  accountActivationLink
}: TActivationEmail) => {
  return (
    <Html>
      <Head />
      <Preview>Verify email, from Aokura Connect</Preview>
      <Tailwind>
        <Body className="bg-slate-200 text-gray-600 font-sans">
          <Container className="w-[480px] bg-white border border-solid border-slate-300 rounded p-5 mt-5">
            <Section className="pb-5">
              <Img
                src={`https://i.postimg.cc/jdGB752Y/logo-no-background.png`}
                width="100"
                height="56"
                alt="Vercel"
                className="mx-auto my-0"
              />
            </Section>
            <Section>
              <Row>
                <Column className="h-[1px] bg-zinc-200 w-[185px]" />
                <Column className="h-[1px] bg-[#9d6bff] w-[110px]" />
                <Column className="h-[1px] bg-zinc-200 w-[185px]" />
              </Row>
            </Section>
            <Section className="px-5">
              <Text className="text-black text-center text-2xl font-semibold text-[#9f1bff] mt-5">
                Hey {name},{" "}
              </Text>
              <Text className="text-center text-base font-medium text-zinc-500">
                Verify your email to activate your account
              </Text>
              <Link
                href={accountActivationLink}
                className="text-white bg-[#9d6bff] rounded-[4px] px-12 py-3 block mx-auto mt-5 text-center text-base w-fit font-medium mb-28 mt-8"
              >
                Verify Account
              </Link>
            </Section>
          </Container>
          <Section className="w-[480px] mt-5 mb-3 ">
            <Row className="w-[105px]">
              <Column className="mr-1">
                <Link href="https://x.com/sarthakroy107">
                  <Img
                    src={`https://i.postimg.cc/L8WhcGHV/99655e9fe24eb0a7ea38de683cedb735-removebg-preview.png`}
                    width="28"
                    height="28"
                    alt="Twitter"
                    className="mx-auto my-0"
                  />
                </Link>
              </Column>
              <Column className="mr-1">
                <Link href="https://github.com/sarthakroy107">
                  <Img
                    src={`https://i.postimg.cc/B6Ms21wn/25231-removebg-preview.png`}
                    width="25"
                    height="25"
                    alt="Github"
                    className="mx-auto my-0"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="https://www.linkedin.com/in/sarthakroy107/">
                  <Img
                    src={`https://i.postimg.cc/mDGJh2L2/logo-linkedin-logo-icon-png-svg-removebg-preview.png`}
                    width="28"
                    height="28"
                    alt="LinkedIn"
                    className="mx-auto my-0"
                  />
                </Link>
              </Column>
            </Row>
            <Text className="text-center text-base font-medium text-zinc-500 mt-5">
              © 2024 Aokura Connect. All rights reserved.
            </Text>
            <Text className="text-center text-base font-medium text-zinc-500">
              Delevoped & maintained by <span className="text-black/75 font-semibold mb-8">Sarthak Roy</span>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};
