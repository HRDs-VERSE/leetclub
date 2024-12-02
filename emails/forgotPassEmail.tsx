import {
    Head,
    Font,
    Heading,
    Section,
    Text,
    Html,
    Tailwind,
  } from "@react-email/components";

  interface ForgotPassEmailProps {
    username: string;
    otp: any;
}
  
  export default function ForgotPasswordEmail({ username, otp }: ForgotPassEmailProps) {
    const fullNameStr = String(username || "User");
    const otpCodeStr = String(otp || "123456");
  
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Reset Your Password</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
                {/* Inline styles to override default link colors */}
                <style>
                    {`
                        a, a:visited, a:hover, a:active {
                            color: inherit !important;
                            text-decoration: none !important;
                        }
                    `}
                </style>
            </Head>
            <Tailwind>
                <Section className="bg-black rounded-[8px] w-[20rem] p-[2rem] text-white flex flex-col justify-center">
                    <Heading className="font-semibold text-[1.2rem] mb-4">Forgot Password</Heading>
                    <Text className="mb-4">Hi {fullNameStr},</Text>
                    <Text className="mb-4">
                        We received a request to reset your password. Use the OTP code below to complete the process:
                    </Text>
                    <Text
                        className="bg-neutral-700 text-white text-[1.5rem] py-2 px-4 rounded-[8px] mb-4 text-center"
                        style={{ color: "#ffffff", textDecoration: "none" }} // Override color
                    >
                        {otpCodeStr}
                    </Text>
                    <Text className="mb-4">
                        If you did not request a password reset, please ignore this email or contact support.
                    </Text>
                </Section>
            </Tailwind>
        </Html>
    );
  }