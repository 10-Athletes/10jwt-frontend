import React, { Component } from 'react';
import { config } from './utility/Constants'
import Background from './bg.jpeg'
import { Button, Form, Container, Row, Col, Modal, Card, CloseButton } from 'react-bootstrap';
import styles from './Signin.css'
import jwtDecode from 'jwt-decode'



// let logo = "/logo2.png";
// let bg = "/bg2.jpg";
class Signin extends Component {
  constructor(props){
    super(props);
    this.state={
      open: false,
      open2: false,
      open3: false,
      open4: false,
      errors: []
    }
    this.forgotPassword = this.forgotPassword.bind(this)
  }

  componentDidMount(){
    let user = {}
    let jwt = window.localStorage.getItem('jwt');
    if(jwt){
      let result = jwtDecode(jwt)
      if(result.username){
        user = result
      } else{
        this.props.history.push('/rankings')
      }
    }
  }

  isValid() {
    let username = this.inputNode5.value
    let firstname = this.inputNode6.value
    let lastname = this.inputNode7.value
    let email = this.inputNode8.value
    let password = this.inputNode9.value
    let underage = this.inputNode91.checked
    let terms = this.inputNode92.checked
    let errors = {username, firstname, lastname, password, email, underage, terms, errorsFound: 0}
    if(username.length < 1){
      errors.username = "Username required"
      errors.errorsFound+= 1
    } else {
      errors.username = ""
    }
    if(firstname.length < 1){
      errors.firstname = "First name required"
      errors.errorsFound+= 1
    } else {
      errors.firstname = ""
    }
    if(lastname.length < 1){
      errors.lastname = "Last name required"
      errors.errorsFound+= 1
    } else {
      errors.lastname = ""
    }
    if(password.length < 8){
      errors.password = "Password must be at least 8 characters"
      errors.errorsFound+= 1
    } else {
      errors.password = ""
    }
    if(email.length < 1){
      errors.email = "Email required"
      errors.errorsFound+= 1
    } else{
      errors.email = ""
      var atFound = false
      var dotFound = false
      var invalid = false
      for(var i = 0; i < email.length; i++){
        var lastAt = 0
        if(email[i] === '@'){
          atFound = true
          lastAt = i
        }
        if(atFound && !dotFound && email[i] === '.'){
          dotFound = true
          if(email.length - i < 3){
            invalid = true
          } else if (i - lastAt < 2) {
            invalid = true
          }
        }
      }
      if(!dotFound || invalid){
        errors.email = "Your email address is improperly formatted"
        errors.errorsFound+= 1
      } else {
        errors.email = ""
      }
      if(!terms){
        errors.terms = "You must agree to the Terms and Conditions and Privacy Policy"
        errors.errorsFound+=1
      } else {
        errors.terms = ""
      }
      if(!underage){
        errors.underage = "You must be at least 18 years of age to use 10Athletes"
        errors.errorsFound+=1
      } else {
        errors.underage = ""
      }
    }
    return errors
  }

  forgotPassword(event){
    event.preventDefault()
    let url = config.url.BASE_URL + 'password/reset'
    var formDataReset = new FormData();
    formDataReset.append("emailOrUsername", this.inputNode10.value);
    fetch(url,
    { method: 'POST', body: formDataReset })
    this.closeModal2()
  }

  handleSubmit = event => {
    event.preventDefault();
    var formData = new FormData();
    formData.append("username", this.inputNode1.value);
    formData.append("password", this.inputNode2.value);
    let url = config.url.BASE_URL + 'tokens'
    fetch(url,
    { method: 'POST', body: formData })
    // eslint-disable-next-line
    .then(res => res.json()).then(res => (console.log(res.jwt),
    window.localStorage.setItem('jwt', res.jwt)))
    .then(() => this.props.history.push('/profile'))
    .catch(setTimeout(() => this.setState({errors: ["Invalid username or password"]}), 1500))
  }

  handleRegisterSubmit = event => {
    event.preventDefault();
    let errorsFound = this.isValid()

    var formData = new FormData();
    formData.append("username", this.inputNode5.value);
    formData.append("firstname", this.inputNode6.value);
    formData.append("lastname", this.inputNode7.value);
    formData.append("email", this.inputNode8.value);
    formData.append("password", this.inputNode9.value);

    var formDataToken = new FormData();
    formDataToken.append("username", this.inputNode5.value);
    formDataToken.append("password", this.inputNode9.value);
    let url = config.url.BASE_URL + 'users'
    let url2 = config.url.BASE_URL + 'tokens'

    if(errorsFound.errorsFound === 0){
      fetch(url,
      { method: 'POST', body: formData })
      .then(() =>
      fetch(url2,
      { method: 'POST', body: formDataToken}))
      // eslint-disable-next-line
      .then(res => res.json()).then(res => (console.log(res.jwt),
      window.localStorage.setItem('jwt', res.jwt)))
      .then(() => {
        this.props.history.push('/profile')
        this.setState({ open: false, errors: [] });
      })
      .catch(setTimeout(() => this.setState({errors: ["Username already in use"]}), 1500))
    } else {
      this.setState({errors: errorsFound})
    }
  }

  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false });
  openModal2 = () => this.setState({ open2: true });
  closeModal2 = () => this.setState({ open2: false });
  termsAndConditions = () => this.setState({ open3: true });
  closeModal3 = () => this.setState({ open3: false });
  privacyPolicy = () => this.setState({ open4: true })
  closeModal4 = () => this.setState({ open4: false });

  render() {
    return (
      <Container fluid style={{marginTop: "5%"}}>
        <Row>
        <Col xl="1">
        </Col>
          <Col xl="6">

      <div className="d-none d-xl-block text-center" style={{height: '20vh', fontFamily: "boogaloo", fontSize: '15vh'}}>
      <span className="ten-logo"><span style={{letterSpacing: "-10px"}}>1</span>0</span><span className="ten-logo-athletes">Athletes</span>
      </div>
      <div className="d-none d-xl-block text-center"><span className="descriptive-tagline-big" style={{height: '7vh', fontSize: '5vh', fontFamily: "boogaloo"}}>Play Sports, Get Ranked</span></div>
      <div className="d-block d-xl-none text-center pt-5 m-5" style={{height: '4vh', fontFamily: "boogaloo", fontSize: '4vh'}}>
      <span className="ten-logo"><span style={{letterSpacing: "-4px"}}>1</span>0</span><span className="ten-logo-athletes">Athletes</span><br/>
      <span className="descriptive-tagline-small" style={{fontSize: '3.5vh'}}>Play Sports, Get Ranked</span>
      </div>
      <Card className="border-0 d-none d-xl-block" style={{backgroundRepeat: 'no-repeat', backgroundImage: `url(${Background})`, height: '50vh', marginTop: '5vh'}}>
      </Card>
          </Col>
          <Col xl="1">
          </Col>
          <Col className="mt-3 mt-xl-5 pt-xl-5" xl="3">
        <div>
        <span className="d-none d-xl-block" style={{marginTop: "15%"}}></span>
        <Card className="shadow mt-5" style={{backgroundColor: "#eee"}}>
        <Form align="center" style={{fontSize: 'xx-large'}} onSubmit={this.handleSubmit}>
        <Row className="px-3 my-4">
          <Col xs="12">
            <Form.Group>

            <Form.Control
              size="lg"
              id="usernameInput"
              placeholder="  Username or Email"
              type="name"
              name="username"
              required
              isInvalid={!!this.state.errors.username}
              ref={(node) => {
                this.inputNode1 = node;
              }}
            />
            <Form.Control.Feedback className="error-message" type='invalid'>
              { this.state.errors.username }
            </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="px-3">
          <Col xs="12">
            <Form.Group>

              <Form.Control
                size="lg"
                className="mb-2"
                id="passwordInput"
                placeholder="  Password"
                type="password"
                name="password"
                required
                isInvalid={!!this.state.errors.password}
                ref={(node) => {
                  this.inputNode2 = node;
                }}
              />
              <Form.Control.Feedback className="error-message" type='invalid'>
                { this.state.errors.password }
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

          <div id="inlineSlot " align="center" className="">

            <Col xs="12">
            <Button className="mt-3 mb-4 w-100"size="lg" type="submit" value="Sign In" >
              <b>Sign In</b>
            </Button>
            </Col>
            <Col>
            <Button variant="link" size="lg" onClick={this.openModal2}>
            Forgot Password
            </Button>
            </Col>
            <Col className="mb-3 sign-in-error text-center">
              {this.state.errors[0]}
            </Col>
            <Row className="mx-3" style={{marginLeft: "10%", marginRight: "10%", borderBottom: "1px solid #435685"}}>
            </Row>
            <Row>
              <Col xs="12">
                <Button size="lg" className="signupButton my-4 w-50" variant="success" onClick={this.openModal}><b>Sign Up</b></Button>
              </Col>
            </Row>
          </div>
          <Modal backdrop="static" centered show={this.state.open3} onHide={this.closeModal3}>
            <Modal.Header>
              <Modal.Title className="text-center">10 Athletes, Inc.<br/>
  Terms of Service</Modal.Title>
              <CloseButton onClick={this.closeModal3}>X</CloseButton>
            </Modal.Header>
            <Modal.Body>
            <span>
Last Updated on June 2, 2022<br/>
<b>Agreement to Terms<br/></b>
Welcome to 10 Athletes!<br/>
All references to us, we or our refers to 10 Athletes, Inc.  Our Terms of Service for our “Platform”, which means any website, application, or service we offer. These Terms of Service are our legal agreement regarding your usage of the Platform which includes information about your legal rights and covers areas such as automatic subscription renewals, limitations of liability, resolution of disputes by arbitration, and a class action waiver.  If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the site and you must discontinue use immediately.  Furthermore, if you violate these Terms of Service, we may suspend or terminate your account in our sole discretion.  We may also amend these Terms of Service at any time.  Please periodically check our website for update.
By using our Platform, you agree that you are at least 18 years of age; and, we grant you a limited, non-exclusive, revocable, non-sublicensable, non-transferable right to use the Platform in order to access and use the services and features that we make available to you.
<br/><br/>
<b>Your Information and Applicable Fees</b><br/>
When you register to use certain aspects of our Platform, you may incur fees which will be disclosed to you per your purchase order.  The fees and any applicable term commitment may automatically renew.
Using our Platform involves potentially interacting with other sports participants, and you may share your personally identifiable information with such participants. We cannot control how those participants use your information.  However, we comply with all applicable privacy laws in connection with our usage of your personally identifiable information.  Please review our privacy policy for details.
Payments will be processed via third-party sites which we do not own or control, and which you recognize and agree that we cannot be liable for a security breach of any third-party sites or services.
<br/><br/>

<b>Your Content and Content of Others</b><br/>
You are responsible for your “Content”, which means any information, material, or other content posted to our Platform. Your Content is subject to these Terms of Service.  By using our Platform, you are agreeing to provide us with a perpetual license to use your Content for any legal or commercial purpose.
As for any Content presented on our Platform, you represent and warrant that:
You have all the permissions and licenses legally required to post the Content on the Platform;
Your Content does not include personal or confidential information belonging to others; and
Your Content does not violate the rights of any third party.
<br/><br/>
We are not responsible for Content that members post or the communications that members send using our Platform.  If you see Content that violates our Terms of Service, you may report inappropriate Content to us.  However, we do not have any obligation to remove Content or postings from other users on the Platform.
Our Intellectual Property Rights
<br/><br/>
You agree that our Platform and all underlying intellectual property, including any content or trademarks, shall remain our sole and exclusive property, and you obtain no rights thereto except for the limited usage rights described in these Terms of Service.
<br/><br/>
<b>Modification, Suspension and Termination of Your Account</b><br/><br/>

In our sole discretion, we may modify, suspend, or terminate your account or access to the Platform for any reason, including if we determine that you have violated these Terms of Service.  We also may remove accounts of members who are inactive for an extended period of time.
<br/><br/>
When our Platform uses third party services to provide specific services to users, you may be required to comply with such third party’s terms of service.
<br/><br/>


<b>Compliance with these Terms and Applicable Laws</b><br/><br/>

Our Platform contains proprietary and confidential information. You agree that you will not, and you will not permit others to (a) use, host, reproduce, modify, reconfigure, or create derivative works of the Platform; (b) remove or alter the proprietary notices on the Platform; or, (c) rent, lease, resell, distribute, or use the Platform for commercial purposes that are not contemplated by this Agreement.
You also agree that you will not use the Platform to solicit or collect personal information from others except as necessary for the participation in a sporting event as contemplated by this Platform.
<br/><br/>
You agree that at all times, you will comply with all applicable laws.  You agree that you will not: (a) extract data from the Platform for a commercial purpose not permitted by these Terms of Service, including through use of an automated system or software (i.e. “screen scraping,” “data scraping,” or “web scraping”); or, (b) engaging in any activity that interferes with or disrupts, that is designed to interfere with or disrupt, or imposes undue burdens on the Platform or its systems.
<br/><br/>
<b>Indemnification and Release</b><br/><br/>

Except where otherwise prohibited by applicable laws, you agree to indemnify, defend and release from any Claims, made by any third party due to or arising out of (a) your violations of these Terms of Service, (b) your misuse of our Platform, (c) your Content, (d) your violation of any law, statute, ordinance or regulation or the rights of a third party, or (e) your participation or conduct in a sporting event which includes certain inherent risks. You agree to promptly notify us of any third-party Claims, and you agree not to settle any Claim without our prior written consent.
To the extent permitted by law, you agree that we are not liable for any third-party acts, and you agree to release us from any sporting activities in which you engage, or your interactions with any other participants via the Platform.
<br/><br/>
<b>Warranty Disclaimers; Limitation of Liability</b>
<br/><br/>
As with all technology, we cannot guarantee that the Platform will at all times function without errors or interruptions. For that reason, our Platform and services are provided to you “as is”; and, to the extent legally permitted, we disclaim all warranties of any kind, including but not limited any statutory or implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We also disclaim any warranties regarding (a) the reliability, timeliness, accuracy, and performance of our Platform, (b) any information, advice, services, or goods obtained through or advertised on our Platform or by us, as well as for any information or advice received through any links to other websites or resources provided through our Platform, (c) the results that may be obtained from the Platform, and (d) the correction of any errors in the Platform, and (e) any third-party services or interactions with other participants through our Platform. Some jurisdictions do not permit certain warranty limitations in which instance the foregoing shall be limited to the extent allowed by applicable law.
<br/><br/>
To the full extent permitted by applicable law, you agree that in no event shall we be liable for any direct, indirect, incidental, special, or consequential damages, including but not limited to, damages for loss of profits, goodwill, use, or other intangible losses (even if we have been advised of the possibility of such damages) arising out of or in connection with (a) our Platform or the inability to use our Platform (however arising, including our negligence), (b) statements or actions of any user or third party on the Platform, (c) your participation in sporting events as a result of using our Platform, or (d) any other matter relating to the Platform. To the extent permitted by law, our liability to you in any circumstance is limited to the greater of $100 or the amount of fees, if any, you paid to us in the 12 months prior to the action that may give rise to liability.  The limitations set forth herein will not limit or exclude liability for our gross negligence, fraud, or intentional, malicious, or reckless misconduct.
<br/><br/>
<b>Dispute Resolution</b><br/><br/>

Except for obtaining injunctive or equitable relief, you agree to submit any claim to arbitration when legally permissible. In arbitration, certain rights that you or we would have in court may not be available, such as discovery or appeal. You are hereby waiving any right to trial in a court of law. This agreement to arbitrate shall apply regardless of whether the claim arises during or after any termination of this Terms of Service.  The venue for arbitration is Sacramento, California.
Any claim subject to arbitration must be filed within one year after the date the party asserting the claim first knows or should know of the act, omission or default giving rise to the claim.
You agree to resolve disputes with us on an individual basis, and you are expressly waiving any right to participate in class actions.
Notwithstanding the foregoing, we may bring an action in a court of applicable jurisdiction to obtain injunctive relief or equitable relief for breach of any confidentiality or intellectual property rights, the monetary damages of which cannot be readily quantifiable.
<br/><br/><br/>



<b>General Terms</b><br/><br/>

You will have deemed to consent to any modifications to these Terms of Service by your continued use.
No agency, partnership, joint venture, or fiduciary relationship is intended between you and us is by this Agreement.
This Agreement and the relationship between you and us shall be governed by the laws of the State of California without regard to its conflict of laws provisions.
This Agreement is not assignable, transferable, or sublicensable by you but may be assigned or transferred by us to any affiliate or subsidiary, or in connection with a change of control, merger, or acquisition.
A party’s failure to exercise or enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision and does not waive any right to act with respect to subsequent or similar breaches.  All waivers must be in writing by the party waiving such right.
If any provision of this Agreement is found to be invalid by a court of competent jurisdiction, all other terms of this Agreement will remain in full force and effect.
Those provisions which by their nature are intended to remain in full force and effect following termination, including but not limited to intellectual property rights and confidentiality, shall survive any termination or expiration of these Terms of Service.<br/><br/>
</span>
<Button className="mx-auto w-100" size="lg" onClick={this.closeModal3}>Close</Button>
              </Modal.Body>
            </Modal>
            <Modal backdrop="static" centered show={this.state.open4} onHide={this.closeModal3}>
              <Modal.Header>
                <Modal.Title className="text-center">10 Athletes, Inc.<br/>
    Privacy Policy</Modal.Title>
                <CloseButton onClick={this.closeModal4}>X</CloseButton>
              </Modal.Header>
              <Modal.Body>
              <span><b>BY USING THIS WEBSITE, OUR PLATFORM, OR ANY OF OUR SERVICES (“SERVICES”), YOU AGREE TO BE BOUND BY THIS ONLINE PRIVACY POLICY. IF YOU DO NOT AGREE TO THIS ONLINE PRIVACY POLICY, DO NOT USE OR SUBMIT PERSONAL INFORMATION TO US IN ANY MANNER.</b><br/><br/>
10 Athletes Inc. and its subsidiaries and affiliates (collectively, "we," "us," "our," or the "Company") cares about the privacy concerns of the visitors to its site and platform. This Online Privacy Policy (this "Privacy Policy") outlines the types of Personal Information that you may provide to us on any website or platform controlled by the Company that links to this Privacy Policy (such websites, including any mobile app/sites maintained by the Company, are referred to, individually and collectively, as the "Website") and explains how the Company handles such Personal Information. This Privacy Policy does not apply to Personal Information collected from you offline, to websites that do not link to this Privacy Policy, or to third-party websites to which the Website may link. Your use of the Website is subject to this Privacy Policy and the applicable Website terms and conditions (capitalized terms set forth but not otherwise defined herein have the meanings ascribed thereto in the Website terms and conditions).<br/><br/>

<b>Definition of "Personal Information"</b><br/><br/>
"Personal Information" means information that can be linked to a visitor, identifies any visitor, or could reasonably be used to identify such visitor that is, in each case, submitted to or collected by the Website and maintained by the Company in an accessible form, and it includes information actively submitted by you and passively collected information, as well as information submitted by other members and guests via referrals or in connection with any applicable fees, as described below.
<br/><br/>

<b>Collection of Personal Information Online</b><br/><br/>
Identifiers such as email addresses and other Personal Information of visitors, such as a first and last name, home or other physical address, or telephone number, are known to the Company only when voluntarily submitted, for example, via registration for sweepstakes or contests, content submissions, suggestions or participation in online interactive activities, or in connection with making online purchases of the Company's services, or via referrals from other members or guests, or in connection with payments made via the Website.  Similarly, financial information of visitors, such as credit or debit card numbers, is known to the Company only when voluntarily submitted in connection with purchasing goods or services available through the Company's Website, in which case certain commercial information, such as products or services purchased or considered, is also known. Any financial transactions will be conducted via a third-party service provider.  Such identifiers, financial information, and commercial information is collected for the purpose of transacting a sale and supporting a consumer's use of any purchased products or services. Such information may also be used to evaluate and improve our customers' experience, analyze trends, to provide you with 10 Athletes offerings on third-party sites, and in connection with your Website usage. <br/><br/>
Certain Internet or other electronic network activity information of visitors is recorded by the standard operation of Internet servers of the Company or by the Company's advertising and analytics technology services.  The Company may use tracking tools such as Heroku and Netlify in connection with Company’s platform.  In relation to the above, information tracked may includes the visitor's type of operating system (e.g., iOS, Android, Windows), the type of browser (e.g., Internet Explorer, Chrome, Firefox, Safari), geographic location, internet protocol (IP) addresses, bounce rates, page views, actions taken on pages, referring/exit pages, user agent string, and other device metadata. We use the information you have provided to us to improve and facilitate services, to offer you Company services on third-party sites, but not to sell your information to third parties to contact you in connection with such third-party services for profit. <br/><br/>
As referenced above, the Website may use advertising and analytics technology services which operate via cookies and pixel tags (or similar technologies) to track visitor preferences and provide personalization features. Collectively, this information is primarily used to provide an enhanced online experience for the visitor and to analyze trends, measure site traffic, administer the site, track user's movement around the site, and gather demographic information, and retarget users (or similar users, also known as "look-a-like" audiences) to our website via advertisements on third-party digital properties. <br/><br/>
If you access our Website through a mobile device, we may collect the geolocation data such as the physical location of your device by, for example, using satellite, cell phone tower, or Wi-Fi signals. We may use your device's physical location to provide you with location-based services and content and to learn who is available to participate in sports activities in the agreed upon recreational areas. You may be able to allow or deny such uses of your device's location by changing your device's location settings, but if you choose to deny such uses, we may not be able to provide you with location-based services and content.<br/><br/>

<b>Use of Personal Information</b><br/><br/>
In addition to any other uses set forth herein, Personal Information may be used: (1) to help the Company better understand visitors' use of the Website; (2) to respond to specific requests from visitors; (3) to provide notices to visitors, such as marketing information, and new offerings as well as to communicate with visitors; and, (4) to protect the security or integrity of the Website. In addition, certain Personal Information may be submitted through online forms on the Website necessary to provide services offered by the Website. After you have entered Personal Information into a form or data field on the Website, the Company may use certain identifying technologies to allow the Website to "remember" your personal preferences, such as sections of the Website that you use frequently. The Company may also use Personal Information for other business purposes, such as to offer you the opportunity to receive notices regarding the Company's products or services, to invite you to participate in surveys about our service offerings, or to notify you about special promotions, and for purposes of data analysis, audits, fraud monitoring and prevention, developing new products and services, enhancing, improving or modifying our services, identifying usage trends, determining the effectiveness of our promotional campaigns, and operating and expanding our business activities.<br/><br/>
To the extent that you may communicate personally identifiable information with other visitors via our Website, you acknowledge and agree that we do not control how other visitors may use your information.<br/><br/>

<b>Limitations on Collection of Personal Information</b><br/><br/>
You may always limit the amount and type of actively transmitted Personal Information that the Company receives about you by choosing not to enter any Personal Information into forms or data fields on the Website. However, some online services can only be provided to you if you provide appropriate Personal Information; for example, certain financial and other information is required to participate in certain services. Other parts of the Website may ask whether you wish to opt out or opt in to receive information about offers, promotions and additional services that may be of interest to you.<br/><br/>
Some internet browsers allow you to limit or disable the use of tracking technologies that collect passively transmitted information. More detailed information about cookie management or other passive transmissions by specific web browsers can be found at the browser's respective websites.<br/><br/>
<b>Right of User Removal</b><br/><br/>
10Athletes has the right to disconnect someone from usage of its website if their behavior violates fellow site users’ sense of well-being. We will not interfere in communications between  the users of the website, but in the event of a complaint, we hold to right, though not the obligation, to remove said offender from use of website services.<br/><br/>
<b>Transmission of Personal Information to Third Parties</b><br/><br/>
Unless otherwise disclosed, Personal Information will not be transferred or otherwise disclosed to anyone other than agents of the Company or authorized recipients, such as service providers that are reasonably needed to provide our various services and features (e.g., hosting vendors, customer support, security vendors, CRM providers).  However, the Company reserves the right to disclose Personal Information to respond to authorized information requests from government authorities, to address national security situations, or when otherwise required by law, in the Company's sole discretion.<br/><br/>
The Company is not responsible for the practices, policies, or content applicable to third-party sites. Inclusion of a link to another site does not imply endorsement by the Company.<br/><br/>
Personal Information may also be shared by the Company with its affiliates, and with vendors that help access and manage the information (all of the foregoing collectively, "authorized recipients"), but in all instances the information will be used only for the purposes enunciated in this policy.<br/><br/>


<b>Use of Cookies</b><br/><br/>
When you view the Website, the Company may temporarily store some information on your computer. This information will be stored in the form of a "cookie" and contain information about visitors' preferences, record user-specific information on which pages a visitor may access or uses and customize web page content based on visitors' browser types or other information that a visitor sends via their browser or other means. Passive information collection technologies such as cookies can make your use of the Website easier by allowing the Company to provide better service, customize sites based on consumer preferences, compile statistics, analyze trends, and otherwise administer and improve the Website. Certain features of the Website may not work without use of passive information collection technologies. These techniques help the Company and the Website functions in many ways, but with strict restrictions on their use. First, Company cookies expire 30 days after the end of the applicable browser session so that the site cannot track your activities over an extended period of time, and so that no permanent storage is used by these cookies. Second, Company cookies are only used in order to provide convenience to you (for example, to reduce repetitive typing) and to allow the Company to tailor the site to better match your interests and preferences. For purposes of this Privacy Policy, a "browser session" will be deemed to have ended when your Internet browser is closed.<br/><br/>
With most Internet browsers, you can erase cookies from your computer hard drive, block all cookies, or receive a warning before cookies are stored. Please refer to your browser instructions or help screen to learn more about these functions.<br/><br/>

<b>Security of Personal Information</b><br/><br/>
The Company endeavors to ensure that Personal Information is protected while you are on the Website.  However, the confidentiality of Personal Information transmitted over the Internet cannot be guaranteed. We urge you to exercise caution when transmitting Personal Information over the internet, especially Personal Information related to your health.  You are solely responsible for maintaining the confidentiality of your user ID and password.  The Company cannot guarantee that unauthorized third parties will not gain access to Personal Information; therefore, when submitting Personal Information to the Website, you must weigh both the benefits and the risks. Please also note that any emails you send us are not encrypted, and we strongly advise you not to communicate any confidential information in your emails to us. If you have reason to believe that your interaction with us is no longer secure (for example, if you feel that the security of any account you might have with us has been compromised), please immediately notify us.<br/><br/>

<b>Links to Other Websites</b><br/><br/>
The Website may contain links to websites operated by others. Each of those third-party sites maintains its own policies about the collection, use, and security of Personal Information. The Company is not responsible for how others use your Personal Information.  Before providing Personal Information to any other website, you should read its privacy policy and terms of use and ensure they are acceptable to you. Notwithstanding any content on the Website indicative of the contrary, the Company makes no endorsement of or representation about any such websites, or any information, software, or other products or materials found there, or any results that may be obtained from using them.<br/><br/>
If you decide to access any website linked to in our Website, you do so entirely at your own risk. The Company does not guarantee that you will receive an alert when you leave the Website, and it is your responsibility to determine when you have left the Website. The Company recommends that you review any third-party website's privacy policies before submitting any information. The Company assumes no responsibility for and shall not be liable for the privacy, terms of use, or other policies of any third-party website, any damage to, or viruses that may infect your computer equipment or other property, or for any loss or corruption of data resulting from any third-party website, including any payment processing sites, navigated to or accessed from links hosted on or contained in the Website.<br/><br/>

<b>Personal Information Related to Children: A Note for Parents or Legal Guardians</b><br/><br/>
Consistent with the Children's Online Privacy Protection Act, the Company is committed to protecting children's privacy on the Internet. The Company does not intend to, or knowingly, collect any Personal Information (including online contact information) of children under the age of 18 through its Website, and we encourage parents or guardians to supervise their children's online activities and to consider using parental control tools available from online services and software manufacturers that help provide a kid-friendly online environment. These tools can also prevent children from disclosing online their names, addresses, and other personal information without your permission. If the Company becomes aware of a child under the age of 18 attempting to register on the Website, the Company will not accept the registration. Once the Company becomes aware of a child under the age of 18 providing Personal Information through the Website, it will attempt to delete that information. If your child has provided Personal Information through the Website, please contact us so it can be deleted. If you are under the age of 18, do not provide the Company with any Personal Information.<br/><br/>

<b>Acceptance of Privacy Terms and Conditions</b><br/><br/>
Your access to and use of the Website is subject to this Privacy Policy and all applicable laws. By accessing and browsing the Website, you accept, without limitation or qualification, this Privacy Policy. The Company reserves the right to at any time to revise this Privacy Policy without prior notice to reflect technological advancements, legal and regulatory changes, and good business practices. If the Company changes its privacy practices, a new Privacy Policy will reflect those changes and the effective date of the revised Privacy Policy will be set forth in the new Privacy Policy. You are bound by any such revisions and should therefore periodically visit this page to review the then-current privacy terms and conditions to which you are bound. If you have questions about the use, amendment, or deletion of Personal Information that you have provided to the Company, or if you would like to opt out of future communications from a Company business or a particular program, please contact us by clicking on the "Contact" link on this Website or by writing to us at:<br/><br/>
<a href="mailto:support@10athletes.com">support@10athletes.com</a><br/><br/>
In all communications to the Company, please include the e-mail address used for registration (if applicable), the website address or the specific program to which you provided Personal Information, and a detailed explanation of your request. If you would like to delete or amend your Personal Information and are contacting us by e-mail, please put "Deletion Request" or "Amendment Request", as applicable, in the subject line of the e-mail. We will do our best to respond to all reasonable requests in a timely manner, in accordance with applicable law.<br/><br/>

This Privacy Policy is effective as of May 18, 2022.<br/><br/>
</span>
<Button className="mx-auto w-100" size="lg" onClick={this.closeModal4}>Close</Button>
                </Modal.Body>
              </Modal>
          <Modal backdrop="static" centered show={this.state.open2} onHide={this.closeModal2}>
            <Modal.Header>
              <Modal.Title>Forgot Password</Modal.Title>
              <CloseButton onClick={this.closeModal2}>X</CloseButton>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.forgotPassword}>
                <Row className="pl-3 pr-3 mt-4">
                  <Col xs="12" className="mb-4">
                    <Form.Group>
                      <Form.Control
                      size="lg"
                      type="name"
                      id="emailOrUsernameInput"
                      placeholder="   Username or Email"
                      name="emailorUsername"
                      required
                      ref={(node) => {
                        this.inputNode10 = node;
                      }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs="4"></Col>
                  <Col className="mt-4 mb-3 px-3" lg="12" xs="6">
                  <Button size="lg" type="submit" className="w-100" variant="success" onClick={this.forgotPassword}>
                    Forgot Password
                  </Button>
                  </Col>
                </Row>
                </Form>
              </Modal.Body>
            </Modal>
          <Modal backdrop="static" centered show={this.state.open} onHide={this.closeModal}>
              <Modal.Header>
                <Modal.Title>Sign Up</Modal.Title>
                <CloseButton onClick={this.closeModal}>X</CloseButton>
              </Modal.Header>
              <Modal.Body>
              <Form onSubmit={this.handleRegisterSubmit}>
              <Row className="pl-3 pr-3 mt-4">
                <Col xs="12" xl="6" className="mb-4">
                  <Form.Group>
                  <Form.Control
                    size="lg"
                    type="name"
                    id="firstNameInput"
                    placeholder="  First Name"
                    name="firstname"
                    required
                    isInvalid={!!this.state.errors.firstname}
                    ref={(node) => {
                      this.inputNode6 = node;
                    }}
                  />
                  <Form.Control.Feedback className="error-message" type='invalid'>
                    { this.state.errors.firstname }
                  </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs="12" xl="6" className="mb-4">
                  <Form.Group>

                  <Form.Control
                    size="lg"
                    id="lastNameInput"
                    type="name"
                    placeholder="  Last Name"
                    name="lastname"
                    required
                    isInvalid={!!this.state.errors.lastname}
                    ref={(node) => {
                      this.inputNode7 = node;
                    }}
                  />
                  <Form.Control.Feedback className="error-message" type='invalid'>
                    { this.state.errors.lastname }
                  </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="pl-3 pr-3 mb-4">
                <Col xs="12">
                  <Form.Group>

                  <Form.Control
                    size="lg"
                    id="usernameInput"
                    placeholder="  Username"
                    type="name"
                    name="username"
                    required
                    isInvalid={!!this.state.errors.username}
                    ref={(node) => {
                      this.inputNode5 = node;
                    }}
                  />
                  <Form.Control.Feedback className="error-message" type='invalid'>
                    { this.state.errors.username }
                  </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="pl-3 pr-3 mb-4">
                <Col xs="12">
                <Form.Group>

                  <Form.Control
                    size="lg"
                    id="emailInput"
                    placeholder="  Email"
                    type="email"
                    name="email"
                    required
                    isInvalid={!!this.state.errors.email}
                    ref={(node) => {
                      this.inputNode8 = node;
                    }}
                  />
                  <Form.Control.Feedback className="error-message" type='invalid'>
                    { this.state.errors.email }
                  </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="pl-3 pr-3">
                <Col xs="12">
                  <Form.Group>

                    <Form.Control
                      size="lg"
                      className="mb-2"
                      id="passwordInput"
                      placeholder="  Password"
                      type="password"
                      name="password"
                      required
                      minLength="8"
                      isInvalid={!!this.state.errors.password}
                      ref={(node) => {
                        this.inputNode9 = node;
                      }}
                    />
                    <Form.Control.Feedback className="error-message" type='invalid'>
                      { this.state.errors.password }
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="px-3 pt-3">
                <Col xs="12">
                  <Form.Group>

                    <Form.Check
                      size="lg"
                      className="mb-2"
                      id="ageCheck"
                      type="checkbox"
                      name="ageCheck"
                      label="I am at least 18 years old"
                      required
                      isInvalid={!!this.state.errors.underage}
                      ref={(node) => {
                        this.inputNode91 = node;
                      }}
                    />

                    <Form.Control.Feedback className="error-message" type='invalid'>
                      { this.state.errors.underage }
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="pl-3 pr-3">
                <Col xs="12">
                  <Form.Group>

                    <Form.Check
                      size="lg"
                      className=""
                      id="terms"
                      type="checkbox"
                      name="terms"
                      label={<span>I agree to the <a href style={{color: "#007BFF"}} className="pl-0 mb-1" onClick={this.termsAndConditions}>
                      Terms and Conditions
                      </a> and <a href style={{color: "#007BFF"}} className="pl-0 mb-1" onClick={this.privacyPolicy}>
                      Privacy Policy
                      </a></span>}
                      required
                      isInvalid={!!this.state.errors.terms}
                      ref={(node) => {
                        this.inputNode92 = node;
                      }}
                    />

                    <Form.Control.Feedback className="error-message" type='invalid'>
                      { this.state.errors.terms }
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Container>
              <Row className="error-username-taken">
              <Col className="text-center mx-auto">
              {this.state.errors[0]}
              </Col>
              </Row>
              </Container>
              <Row>
                <Col xs="4"></Col>
                <Col className="mt-4 mb-3" xs="6" lg="4">
                <Button size="lg" type="submit" variant="success" onClick={this.handleRegisterSubmit}>
                  Sign Up
                </Button>
                </Col>
              </Row>
              </Form>
              </Modal.Body>
            </Modal>
            </Form>

          </Card>
        </div>

            </Col>
          </Row>
        </Container>    );
  }

}

export default Signin;
