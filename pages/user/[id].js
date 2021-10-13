import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import axios from "axios";

import s from './user.module.scss';
import Head from "next/head";
import Link from "next/link";
import config from "constants/config";
import cache from "memory-cache";

const Index = ({ user: serverSideUser }) => {

  const [user, setUser] = React.useState(serverSideUser);

  return (
    <>
      <Head>
        <title> Detail page </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container>
        <Row className={"mb-5"} style={{ marginTop: "10%" }}>
          <Col lg={6} sm={12} className="d-flex flex-column justify-content-center">
            <div className="mb-5">
              <h2 className={"fw-bold"}>{user.data.first_name} {" "} {user.data.last_name}</h2>
              <h6 className={"text-muted"}>
                {user.data.email}
              </h6>
            </div>
            <Link href="/">
                <Button
                    color="primary"
                    className="text-uppercase fw-bold align-self-start"
                >
              Back to user page
            </Button>
            </Link>
            
          </Col>
          <Col lg={6} sm={12} className={s.contactVisual}>
            <img src={user.data.avatar} alt="" />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export async function getServerSideProps(context) {
    const url = config.baseURLApi + "/users/"+context.query.id;

    const cachedResponse = cache.get(url);
    let user = [];

    if (cachedResponse) {
        user = cachedResponse;
    } else {
        const hours = 24;
        const res = await axios.get(`/users/${context.query.id}`);
        cache.put(url, res.data, hours * 1000 * 60 * 60);
        user = res.data;
    }

  return {
    props: { user }, // will be passed to the page component as props
  };
}

export default Index;
