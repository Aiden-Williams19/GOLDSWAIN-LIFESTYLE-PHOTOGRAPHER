
import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <section className="about-page">
      <div className="about-quote">
        <blockquote>
          “HARDSHIP OFTEN PREPARES AN ORDINARY PERSON FOR AN EXTRAORDINARY DESTINY.” <span>– C.S. Lewis</span>
        </blockquote>
      </div>

      <div className="about-content">
        <div className="about-text">
          <p>
            Julian Goldswain has been practising as a commercial photographer in Cape Town since 2001. Growing up in the Eastern Cape 
            and studying photography at NMU (Port Elizabeth) inspired his visual aesthetic. Agencies and editorial creatives alike trust 
            him to inject their brands with his vision.
          </p>

          <p>
            Wedged between the beach and mountain is a quaint 100+ year old beach cottage in Muizenberg, the place he now calls home, 
            shared with his wife, and his two boisterous teenage boys. The beauty of his natural environment keeps him inspired for the next assignment. 
            He shoots mainly on location which provides the flexibility and variety he needs.
          </p>

          <p>
            His tool of choice is a Canon EOS R6 Mk II. His personal work has taken him on travels from mountains to missionary trips throughout 
            Southern Africa. Julian loves capturing mood through the play of light on still and human subjects alike. This exceptional ability coupled 
            with an acute attention to subject detail and composition helped land him commissions from major brands like Momentum, Vodacom, 
            Google and British Airways Highlife.
          </p>

          <p>
            His inner confidence and genuineness have endeared him to CEOs, celebrities, commercial and magazine clients alike. Few photographers 
            have successfully connected the world between photojournalism and advertising like Julian. His work has been exhibited locally and internationally. 
            Magazines including Visi and Private (UK/Italy) have featured his work.
          </p>
        </div>

        <div className="about-image">
          {/* Replace with actual image path */}
          <img src="/images/about-julian.jpg" alt="Julian Goldswain at work" />
        </div>
      </div>
    </section>
  );
};

export default About;
