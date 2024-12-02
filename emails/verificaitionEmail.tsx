import {
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
    Html,
    Tailwind,
} from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: any;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
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
            </Head>
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Tailwind>
                <Section className="bg-gray-100 p-6 rounded-md w-full max-w-md mx-auto">
                    {/* Header */}
                    <Section className="bg-black text-white py-4 rounded-t-md text-center">
                        <Heading as="h2" className="text-lg font-semibold">
                            Welcome to Our Platform!
                        </Heading>
                    </Section>

                    {/* Main Content */}
                    <Section className="bg-white p-6 rounded-b-md shadow-md">
                        <Row className="mb-4">
                            <Text className="text-gray-700 text-md">
                                Hello <strong>{username}</strong>,
                            </Text>
                        </Row>
                        <Row className="mb-4">
                            <Text className="text-gray-700">
                                Thank you for registering with us! Please use the verification code below to complete your registration.
                            </Text>
                        </Row>

                        {/* OTP Code Section */}
                        <Row className="mb-4 text-center">
                            <Text
                                className="bg-gray-200 text-black text-2xl py-3 px-6 rounded-md font-mono tracking-widest"
                                style={{ letterSpacing: "0.2em" }}
                            >
                                {otp}
                            </Text>
                        </Row>

                        {/* Additional Information */}
                        <Row className="mb-4">
                            <Text className="text-gray-600 text-sm">
                                If you did not request this code, you can safely ignore this email. The code will expire in 10 minutes.
                            </Text>
                        </Row>
                    </Section>

                    {/* Footer */}
                    <Section className="text-center text-gray-500 mt-6">
                        <Text className="text-xs">
                            Need help? Contact our support team at{" "}
                            <a
                                href="mailto:support@example.com"
                                style={{ color: "#4A90E2", textDecoration: "underline" }}
                            >
                                support@example.com
                            </a>
                        </Text>
                    </Section>
                </Section>
            </Tailwind>
        </Html>
    );
}