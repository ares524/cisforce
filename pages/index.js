import React, { useState, useEffect } from "react";
import s from "pages/index.module.scss";
import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import {
  Container,
  Card,
  CardBody,
  CardImg,
  CardTitle,
} from "reactstrap";

import PaginationComponent from "react-reactstrap-pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "constants/config";
import cache from "memory-cache";

const Index = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    getUser(page);
  }, []);

  const getUser = (pageParam) => {
    const url = config.baseURLApi + "/user?page="+pageParam;

    const cachedResponse = cache.get(url);

    if (cachedResponse) {
      setUsers(cachedResponse.data);
      setTotalPage(cachedResponse.total);
    } else {
      const hours = 24;
      axios.get(`/users?page=${pageParam}`).then((response) => {
        cache.put(url, response.data, hours * 1000 * 60 * 60);
        setUsers(response.data.data);
        setTotalPage(response.data.total);
      });
    }
  }

  const handleSelected = (selectedPage) => {
    setPage(selectedPage);
    getUser(selectedPage);
  }

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Container>
        <div className={"d-flex justify-content-center mb-5" } style={{ marginTop: "10%" }}>
            {users.map( (user, index) => {
              return <Link href={`/user/${user.id}`} as={`/user/${user.first_name}?userId=${user.id}`}>
                <Card key={index} className="mr-auto" style={{ cursor: "pointer" }}>
                  <CardImg top width="137" src={user.avatar} height={137}  alt="Card image cap" />
                  <CardBody>
                    <CardTitle tag="h5"> {user.first_name} {" "} {user.last_name} </CardTitle>
                  </CardBody>
                </Card>
              </Link>
            } )}
        </div>
        <div className={"d-flex justify-content-center" }>
          <PaginationComponent
            totalItems={totalPage}
            pageSize={3}
            onSelect={handleSelected}
          />
        </div>
        
      </Container>
    </>
  );
};

export async function getServerSideProps(context) {

  return {
    props: { }, // will be passed to the page component as props
  };
}

export default Index;
