import React from "react";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
    return <h1>{currentUser?.email}</h1>;
};

LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get("/api/users/current");
    return data;
};

export default LandingPage;
