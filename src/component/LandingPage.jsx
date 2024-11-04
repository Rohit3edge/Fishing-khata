import React,{useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import logo from '../img/logos/Landing.logo.png';
import img1 from '../img/back.jpg';
import img2 from '../img/compliance.png';
import img3 from '../img/sale.png';
import img4 from '../img/purchase.png';
import img5 from '../img/pic1.jpg';
import img6 from '../img/pic2.jpg';
import img7 from '../img/pic3.jpg';
import img8 from '../img/pic4.jpg';

const LandingPage = () => {

  const contactSectionRef = useRef(null);
  const navigate = useNavigate();
  const testimonials = [
    {
      name: 'Rajesh Dhawan',
      image: img5,
      text: '“Using this business management software has completely transformed the way we operate our business. It has streamlined our processes, improved our efficiency, and ultimately helped us increase our revenue. I would highly recommend this software to any business looking to take their operations to the next level.” ',
    },
    {
      name: 'Karan Aujla',
      image: img6,
      text: '“As a small business owner, I was initially hesitant to invest in a business management software. But after using this software for just a few weeks, I can confidently say that it was one of the best decisions I have made for my business. It has saved me countless hours of administrative work, and allowed me to focus on what I do best - growing my business.” ',
    },
    {
      name: 'Kailash Kumar',
      image: img7,
      text: '“I have used several business management software solutions in the past, but this one stands out for its user-friendly interface and comprehensive features. It has made it easier for our team to collaborate and communicate, and has improved our overall productivity. I would highly recommend this software to any business looking to streamline their operations.”',
    },
    {
      name: 'Phil Johnson',
      image: img8,
      text: '“Using this business management software has been a game changer for my small business! It has helped us streamline our operations and improve our productivity, all while saving us time and money. I highly recommend it to any business owner looking to take their operations to the next level.',
    },
  ];

  const handleContactClick = () => {
    contactSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="container-fluid px-2 bg-white">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="d-flex align-items-center justify-content-center">
              <a href="#" className="navbar-brand ms-lg-5 logo">
                <img src={logo} alt="logo" className="img-responsive" />
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex align-items-center justify-content-center">
              <button className="btn btn-default" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-default" onClick={handleContactClick}>Contact</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid p-0">
        <div
          className="header-image position-relative"
          style={{
            background: `url(${img1}) center center / cover no-repeat`,
            height: '70vh',
          }}
        >
          <div className="header-caption d-flex flex-column align-items-center justify-content-center text-center h-100">
            <div className="" style={{ maxWidth: '900px' }}>
              <h3 className="text-white custom-header-text">FPO MANAGEMENT ERP SOFTWARE</h3>
              <p className=" text-white mb-md-4 custom-text-style">Empowering Growers and Food Value Chain with Real-Time Insights.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid banner mb-5">
        <div className="container">
          <div className="row gx-0">
            <div className="col-md-12">
              <div className="d-flex flex-column justify-content-center  p-5" style={{ height: '300px', background: '#172b4d', alignItems: 'center' }}>
                <p className="text-white w-75" style={{ lineHeight: '36px', fontSize: '25px' }}>
                  Kisaan management software enables large agribusinesses to have complete control over their farming processes and visibility across different stakeholders. From onboarding all
                  farmers, empowering extension workers to bring all operational data on a single platform, It is just the solution you need.
                </p>
                <button className="btn btn-default2 w-25">Get a Demo</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5">
        <div className="container">
          <h3 className="display-4 text-center mb-4">Most Popular</h3>
          <div className="row g-5">
            <div className="col-lg-4 col-md-6">
              <div className="service-item bg-light text-center p-5">
                <img src={img2} style={{ width: '54%' }}></img>
                <h4 className="mt-3 mb-3">Compliance Management</h4>
                <p className="mb-0" style={{ paddingBottom: '14px' }}>
                  A Compliance Management System (CMS) is a best program designed to keep you on the right side of Fair Lending regulations. Without a CMS, you have no easy way to measure or track
                  compliance; and you’re not confident who in your organization is doing what, when or how.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-item bg-light text-center p-5">
                <img src={img3} style={{ width: '54%' }}></img>
                <h4 className="mt-3 mb-3">FSale Management</h4>
                <p className="mb-0" style={{ paddingBottom: '100px' }}>
                  Our software allows you to generate both GST/Non-GST invoices. You can easily add any number of items with different GST rates in same invoice. We comes with multi-size invoice
                  templates
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="service-item bg-light text-center p-5">
                <img src={img4} style={{ width: '54%' }}></img>
                <h4 className="mt-3 mb-3">Purchase Management</h4>
                <p className="mb-0">
                  We allows you to keep record of your purchases and manage your Stock/inventory. You can also add item barcode or serial number while entering purchase bill. Also you can manage
                  purchase returns. It 's allows you to manage supplier / vendor accounts easily. Also it helps to manage your Purchase Payments and account adjustments.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mt-3">
              <div className="service-item bg-light text-center p-5">
                <h4 className="mt-3 mb-3">Inventory Management</h4>
                <p className="mb-0" style={{ paddingBottom: '43px' }}>
                  You can easily manage your Stock/ Inventory. You can see your stock status live, Get low-stock alerts and get detailed information about your inventory. Also you can track complete
                  stock quantity and stock value with detailed information.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mt-3">
              <div className="service-item bg-light text-center p-5">
                <h4 className="mt-3 mb-3">GST reports</h4>
                <p className="mb-0">
                  These reports provide details of the tax collected and paid by businesses, including the input tax credit claimed and the output tax liability. GST reports are necessary for
                  businesses to comply with the GST law, to track their tax liabilities and to claim refunds. Some common GST reports include GSTR-1, GSTR-3B, GSTR-2A.{' '}
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mt-3">
              <div className="service-item bg-light text-center p-5">
                <h4 className="mt-3 mb-3">Client Management</h4>
                <p className="mb-0">
                  Client management refers to the process of building and maintaining relationships with clients, ensuring their satisfaction and addressing their needs. It involves various activities
                  such as identifying potential clients, acquiring them, understanding their requirements, providing support, and resolving issues to retain their business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid bg-testimonial py-5 my-5" style={{ background: '#f5f5f5' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <OwlCarousel className="owl-theme" items={1} loop nav style={{ background: 'rgba(52, 173, 84, .7)' }}>
                {testimonials?.map((testimonial, index) => (
                  <div key={index} className="testimonial-item text-center text-white pt-4">
                    <img className="testimonial-img img-fluid mx-auto p-2 border border-5 border-secondary rounded-circle mb-4" src={testimonial.image} alt={`Testimonial from ${testimonial.name}`} />
                    <p className="fs-5" style={{padding:"30px"}}>{testimonial.text}</p>
                    <hr className="mx-auto w-25" />
                    <h4 className="text-white mb-0" style={{fontWeight:"700"}}>{testimonial.name}</h4>
                  </div>
                ))}
              </OwlCarousel>
            </div>
          </div>
        </div>
      </div>

      <div ref={contactSectionRef} class="container-fluid bg-footer bg-primary text-white mt-5">
        <div class="container">
          <div class="row gx-5">
            <div class="col-lg-6 col-md-6">
              <div class="row gx-5">
                <div class="col-lg-6 col-md-12 pt-5 mb-5">
                  <h4 class="text-white mb-4 " style={{fontWeight:"700"}}>Get In Touch</h4>
                  <div class="d-flex mb-2">
                    <i class="bi bi-geo-alt text-white me-2"></i>
                    <p class="text-white mb-0">1Office No. 408, 4th Floor, ARG North Avenue Sikar Road, Jaipur, Rajasthan (IND) - 302013</p>
                  </div>
                  <div class="d-flex mb-2">
                    <i class="bi bi-envelope-open text-white me-2"></i>
                    <p class="text-white mb-0">support@kisaankhata.com</p>
                  </div>
                  <div class="d-flex mb-2">
                    <i class="bi bi-telephone text-white me-2"></i>
                    <p class="text-white mb-0">9057999771, 9057999772</p>
                  </div>
                  <div class="d-flex mt-4">
                    <a class="btn btn-secondary btn-square rounded-circle me-2" href="#">
                      <i class="fab fa-twitter"></i>
                    </a>
                    <a class="btn btn-secondary btn-square rounded-circle me-2" href="#">
                      <i class="fab fa-facebook-f"></i>
                    </a>
                    <a class="btn btn-secondary btn-square rounded-circle me-2" href="#">
                      <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a class="btn btn-secondary btn-square rounded-circle" href="#">
                      <i class="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-6 mt-lg-n5">
              <div class="d-flex flex-column align-items-center justify-content-center text-center h-100 bg-secondary p-5">
                <h4 class="text-white" style={{fontWeight:"700"}}>Ready To Digitalized ?</h4>
                <h6 class="text-white">Sign Up Now Join Sign Up today and feel empowered to teach and engage your company through best</h6>
                <p>FPO MANAGEMENT ERP SOFTWARE.</p>
                <form action="">
                  <input type="text" class=" form-control border-white p-3" placeholder="Your Name" />
                  <input type="text" class="form-control border-white p-3 mt-4" placeholder="Your Email" />

                  <input type="text" class="form-control border-white p-3 mt-4" placeholder="Your Phone" />

                  <button class="btn btn-default mt-4">Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid bg-dark text-white py-4">
        <div class="container text-center">
          <span>
            Copyright © 2024{' '}
            <a href="#" className="footer_url">
              Kisaan Khata
            </a>
            . Developed by{' '}
            <a className="footer_url" href="https://www.3edgetechnologies.com/">
              3 Edge Technologies
            </a>{' '}
            All rights reserved.
          </span>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
