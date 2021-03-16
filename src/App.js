import { faFacebook, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import firebase from "firebase/app";
import "firebase/auth";
import React, { useState } from 'react';
import { Button, Col, Container, Form, Image, Modal, Nav, Navbar, Row, Toast } from "react-bootstrap";
import firebaseConfig from "./firebaseConfig";

!firebase.apps.length && firebase.initializeApp(firebaseConfig);

function App() {

  const [modalShow, setModalShow] = useState(false);

  const [show, setShow] = useState(false);

  const [validated, setValidated] = useState(false);

  const [newUser, setNewUser] = useState(true);

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    successful: ''
  });

  const { isSignedIn, name, email, password, photo, error, successful } = user;

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const ghProvider = new firebase.auth.GithubAuthProvider();

  const handleGoogleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then(result => {
        updateUserState(result.user);
      })
      .catch(error => {
        console.log(error);
        UserStatus(error.message, '');
      })
  }

  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then(result => {
        updateUserState(result.user);
      })
      .catch(error => {
        console.log(error);
        UserStatus(error.message, '');
      });
  }

  const handleGhSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(ghProvider)
      .then((result) => {
        updateUserState(result.user);
      }).catch((error) => {
        console.log(error);
        UserStatus(error.message, '');
      });
  }

  const updateUserState = user => {
    const { displayName, email, photoURL } = user;
    const signedInUser = {
      isSignedIn: true,
      name: displayName,
      email: email,
      photo: photoURL,
      successful: "Signed in successfully"
    }
    setUser(signedInUser);
    setModalShow(true);
  }

  const handleSignOut = () => {
    console.log('here');
    firebase
      .auth()
      .signOut()
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          successful: ''
        }
        setModalShow(false);
        setUser(signedOutUser);
      })

      .catch((error) => {
        console.log(error);
        UserStatus(error.message, '');
      });
  }

  const handleBlur = event => {
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password') {
      isFieldValid = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/.test(event.target.value);
    }
    if (isFieldValid) {
      const newUser = { ...user };
      newUser.isSignedIn = true;
      newUser[event.target.name] = event.target.value;
      setUser(newUser);
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    if (newUser && name && email && password) {
      console.log("Signed up successfully");
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          UserStatus('', 'Signed up successfully')
          setModalShow(isSignedIn)
          updateUserName(name)
        })
        .catch(error => {
          console.log(error);
          UserStatus(error.message, '')
        });
    }
    if (!newUser && email && password) {
      console.log("Signed in successfully");
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          UserStatus('', 'Signed in successfully')
          setModalShow(isSignedIn)
        })
        .catch(error => {
          console.log(error);
          UserStatus(error.message, '');
        });
    }
  }

  const UserStatus = (error, success) => {
    const newUser = { ...user };
    newUser.error = error;
    newUser.successful = success;
    setUser(newUser);
    error && setShow(true);
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(result => {
      console.log(result);
    }).catch(error => {
      console.log(error);
      UserStatus(error.message, '');
    });
  }

  function UserInfoModal(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="text-center"
      >
        <Modal.Body>
          <Modal.Header className="pt-0" closeButton >
            <Modal.Title style={{ color: "green" }} id="contained-modal-title-vcenter">
              {successful}
            </Modal.Title>
          </Modal.Header>
          <img src={photo} alt="" />
          <Modal.Title id="contained-modal-title-vcenter">
            Name: {name}
          </Modal.Title>
          <h5 className="mt-2">Email: {email}</h5>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button className="shadow-none" onClick={handleSignOut}>Sign Out</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/" style={{ fontWeight: "bold" }}>Firebase Authentication</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" />
            <Nav>
              <Nav.Link href="/" onClick={(e) => {
                e.preventDefault();
                setNewUser(false);
              }}
                style={{ fontWeight: "500" }}>Sign in</Nav.Link>
              <Nav.Link href="/" onClick={(e) => {
                e.preventDefault();
                setNewUser(true);
              }}
                style={{ fontWeight: "500" }}>Sign up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container >

        <Row className="align-items-center" style={{ height: '80vh' }}>

          <Col md={8}>
            <Image src="https://image.freepik.com/free-vector/online-registration-sign-up-with-man-standing-near-user-interface_268404-96.jpg" fluid />
          </Col>

          <Col md={4} className="px-5 py-4 shadow" style={{ borderRadius: "15px" }}>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <h3 className="text-center mb-4">{newUser ? 'Sign Up' : 'Sign In'}</h3>
              {newUser &&
                <Form.Group controlId="validationCustom01">
                  <Form.Label>Name</Form.Label>
                  <Form.Control onBlur={handleBlur} name="name" className="shadow-none" type="text" placeholder="Name" required />
                  <Form.Control.Feedback type="invalid">
                    Please enter your name.
                            </Form.Control.Feedback>
                </Form.Group>
              }
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control onBlur={handleBlur} name="email" className="shadow-none" type="email" placeholder="Enter email" required />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email.
                        </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control onBlur={handleBlur} name="password" className="shadow-none" type="password" placeholder="Password" required />
                <Form.Control.Feedback type="invalid">
                  Please enter your password.
                        </Form.Control.Feedback>
              </Form.Group>

              <Button className="shadow-none" variant="primary" type="submit" block>
                {newUser ? 'Sign Up' : 'Sign In'}
              </Button>
              <p className="text-right mt-2" style={{ fontSize: '.9rem' }}>
                {newUser ?
                  "Already have an account?"
                  : "Don't have an account?"
                } <a
                  href="/"
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setNewUser(!newUser);
                  }}>
                  {newUser ? 'Sign in!' : 'Sign up!'}
                </a>
              </p>
            </Form>
            <hr className="my-1" />
            <div className="text-center">
              <p className="mb-2" style={{ fontWeight: 'bold' }}>Or Login with</p>
              <Button onClick={handleFbSignIn} className="shadow-none" variant="primary" size="sm">
                <FontAwesomeIcon icon={faFacebook} />
              </Button>
              <Button onClick={handleGoogleSignIn} className="shadow-none mx-1" variant="danger" size="sm">
                <FontAwesomeIcon icon={faGoogle} />
              </Button>
              <Button onClick={handleGhSignIn} className="shadow-none" variant="dark" size="sm">
                <FontAwesomeIcon icon={faGithub} />
              </Button>
            </div>
          </Col>

          <UserInfoModal show={modalShow} onHide={() => setModalShow(false)} />
        </Row>

      </Container>
      <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }} >
        <Toast show={show} onClose={() => setShow(false)} delay={5000} autohide style={{ position: 'absolute', top: 0, right: '50px', }}>
          <Toast.Header>
            <strong className="mr-auto text-danger">&#9888; Warning!</strong>
            <small>close</small>
          </Toast.Header>
          <Toast.Body style={{ fontWeight: "bold" }}>{error}</Toast.Body>
        </Toast>
      </div>
    </>
  );
}

export default App;
