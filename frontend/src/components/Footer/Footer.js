import React from "react";
import {Link} from "react-router-dom";
import {Container, Row, Col} from "react-bootstrap";
import {FaLinkedin, FaTwitter, FaInstagram} from "react-icons/fa";

import "./Footer.css";

export default function Footer(){
    let date = new Date();
    let year = date.getFullYear();

    return(
        <Container fluid className="footer p-0 overflow-hidden">
            <Row className="align-items-center w-100 m-0">
                <Col md="6" className="footer-copyright text-start ps-4">
                    <h4>© {year} All Rights Reserved</h4>
                </Col>
                <Col md="6" className="footer-body text-end pe-4">
                    <div className="footer-right-content">
                        <div className="footer-links">
                            <Link to="/">Home</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/about">About Us</Link>
                        </div>
                        <div className="footer-icons-container">
                            <a href="https://www.linkedin.com/in/naveen-sai-pitani-170850280" target="_blank" className="footer-icons" rel="noreferrer"><FaLinkedin/></a>
                            <a href="https://www.linkedin.com/in/naveen-sai-pitani-170850280" target="_blank" className="footer-icons" rel="noreferrer"><FaTwitter/></a>
                            <a href="https://www.linkedin.com/in/naveen-sai-pitani-170850280" target="_blank" className="footer-icons" rel="noreferrer"><FaInstagram/></a>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}