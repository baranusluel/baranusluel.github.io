---
layout: page
title: About
permalink: /about
---

<div class="row">
<div class="column" style="padding: 0; margin: 0"><h1 style="margin: 0">About Me</h1></div>
<!-- OUTDATED: <div class="column" style="text-align: right"><h3 style="margin: 0"><a href="/assets/BaranUsluel.CV.2020-03-30.long.pdf">Resume (PDF)</a></h3></div> -->
</div>

**Incoming Software Engineer at Facebook** and graduate of **BS in Electrical Engineering at Georgia Tech**,
with ~1 year of experience working on production software.

Technical skills include proficiency in **C++**, **Java** and **Python**.

Built software for hardware products at **Qualcomm** and **Facebook Reality Labs (Oculus)**.

Interested in working across the hardware/software stack for innovative technology.

<hr>

<nav role="navigation">
  <ul>
    <li><a href="#experience">Experience</a></li>
    <li><a href="#education">Education</a></li>
    <li><a href="#projects">Projects</a></li>
  </ul>
</nav>

<h2><a name="experience" class="hidden-link">Experience</a></h2>

### Facebook, Summer 2020

<img class="right-float-pic" src="/assets/oculus_remote.jpg">

Interned at Facebook remotely on the Oculus VR Shell team based in Seattle.

Designed, implemented, and launched alpha testing of a major user-facing feature for multitasking on Oculus Quest devices.

Collaborated cross-functionally with partner teams to enable future of work scenarios in mixed reality.

Contributed 10,000+ lines of production code in **C++** to an infrastructural codebase and overhauled a core component.

### Facebook, Summer 2019

<img class="left-float-pic" src="/assets/fb_pic.jpg"/>

Interned at Facebook in Menlo Park on the Oculus VR OS team.

Introduced the first "Hey Oculus" voice assistant wake-word on the Oculus Quest by assisting in developing an AOSP HAL, performing system integration and writing E2E tests.

Developed automated audio test framework with **Java (JNI)** and **C++** for AOSP-based standalone Oculus VR devices.


### Qualcomm, Summer 2018

<img class="right-float-pic" src="/assets/qc_pic.jpg"/>

Interned at Qualcomm in San Diego on the Snapdragon Display Test team.

Developed an Android app with **Java** for display software testing, which ran **400+ existing** Lua tests and **100+ new** tests.

Increased speed of developer-level tests **2.5x**, resulting in active use by **30+** display software developers.

Implemented 2D, 3D and VR graphics tests with natural and generated content using OpenGL ES (GLES).

### Georgia Institute of Technology, 2018-2019

As an Undergraduate Teaching Assistant, taught introductory computing and MATLAB to **200 students** personally over four semesters.

Created an [automatic homework grader](https://github.com/CS1371/autograder) suite as the Lead Developer of an agile software development team with 8 other TAs.

Enabled the course’s migration to a new CMS by developing a critical data conversion utility in MATLAB.

### Freelance Software Development, 2013-2016

Picked up freelance web and Java development jobs during high school.

Developed and maintained **3 websites** for the clients of a local advertising & PR company (ADD PR Design). Designed responsive themes for WordPress CMS with PHP, HTML, CSS and Javascript.

Built plugins for commercial Minecraft server networks using Java and the Bukkit API to add new gameplay functionality. Wrote **100+** Java plugins (**25,000+ lines**) in total, for clients and as open-source projects ([one with 800,000 downloads](https://github.com/baranusluel/bukkit-simpleprefix)).

<hr>

<h2><a name="education" class="hidden-link">Education</a></h2>

### Georgia Institute of Technology, BSEE 2021

<img class="right-float-pic" style="width: 20%" src="/assets/grad_award.jpg">

Graduated with a Bachelor of Science in **Electrical Engineering** and a minor in **Computer Science** (**Artificial Intelligence** concentration) in May 2021 with a 4.0 GPA.

Received the **Outstanding Electrical Engineering Senior Award** from the School of Electrical and Computer Engineering.

**Relevant Coursework:** Embedded Systems Design, Control System Design, Digital Signal Processing, Deep Learning, Computer Vision, Robotics & Perception, Advanced Programming Techniques, Cryptographic Hardware for Embedded Systems.

**Extracurriculars:** GT Chamber Choir, RoboJackets (Intelligent Ground Vehicle Competition, Electrical Team), Intramural Soccer & Ultimate Frisbee, Tech Treks Alaska.

**Certifications:** Triplebyte Certified Generalist Software Engineer, American Red Cross First Aid/CPR/AED, PADI Open Water Scuba Diver *(in progress)*.

<hr>

<h2><a name="projects" class="hidden-link">Projects</a></h2>

### Flightie Talkie: Capstone Design Project, 2021
<img class="left-float-pic" src="assets/capstone_poster.png">

Designed and integrated a long-range two-way audio communication payload with the SkyRaider R80D SUAS for the US Army Rangers.

Awarded one of three [People's Choice Awards](https://www.ece.gatech.edu/news/646971/ece-shines-spring-2021-capstone-design-expo) out of 186 teams at the 2021 Spring Design Expo.

Learn more from my [featured interview](https://sites.gatech.edu/gtdepict/2021/05/20/throwback-thursday-with-flightie-talkie/) and the [team's expo page](https://expo.gatech.edu/prod1/portal/portal.jsp?c=17462&p=413142918&g=413665329&id=413929993).

<br style="clear: left;">

### Square On: The Magic Chess Robot, 2020

<iframe class="right-float-pic" style="margin-bottom: 20px" src="https://www.youtube.com/embed/3NJV737BzyU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Designed and built an open-source and *highly*-DIY version of the commercial Square Off smart chess board.

Constructed a custom X-Y cartesian robot using the CoreXY design concept, equipped with an electromagnet for moving chess pieces.

Read more on our [build log](https://baranusluel.com/square-on/).

<br style="clear: right;">

### Resisting Adversarial Attacks by k-WTA, 2020

<img class="left-float-pic" style="margin-bottom: 20px;" src="/assets/kwta_relu.JPG">

Demonstrated reproducibility of empirical results of ICLR 2020 paper *"Enhancing Adversarial Defense by k-Winners-Take-All"* (Xiao et al.).

Utilized **PyTorch** to replace ReLU activations in well-known deep model architectures with the k-WTA activation function, and test performance under several white-box attacks.

Discovered a significant performance overhead not mentioned in the original work, and proposed a workaround to improve training time.

See our [final report](https://github.com/baranusluel/kWTA-activation/raw/master/CS7643_Final_Report.pdf) and our [project repo](https://github.com/baranusluel/kWTA-activation).
<br style="clear: left;"><br>

### Sentiment Analysis with CNNs, 2020

<img class="right-float-pic" style="height: 150px; width: auto" src="/assets/sentiment_wordcloud.png">

Trained a deep convolutional neural network with **Keras** to perform sentiment analysis on movie reviews using word2vec embeddings.

Achieved a test accuracy of 71% on the Bo Pang et al. movie review 'scale dataset v1.0'.

See our [final report](https://baranusluel.com/sentiment-cnn/) as a Github Page.
<br style="clear: right;"><br>

### Autoknoby: HackMobile project, 2018

<iframe class="left-float-pic" style="margin-bottom: 20px" src="https://www.youtube.com/embed/xL6oJc1dAVI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Led a team making [an IoT facial-recognition system](https://github.com/baranusluel/autoknoby) at Qualcomm's Intern Hackathon. Awarded **‘Most Innovative Hack’** and ‘Top 10 Best Hack’ from 60 teams.

Leveraged Python and OpenCV for facial detection, with Microsoft’s Face API for recognition, on a DragonBoard 410c.
<br style="clear: left;">

<a href="https://2048.baranusluel.com/"><img class="right-float-pic" src="/assets/2048_3d.gif"></a>

### 2048 3D: Mobile and web game, 2018

Developed a [fully 3D version](https://github.com/baranusluel/2048-3d) of the popular 2048 game using Unity and C#, for web and Android (Google Play) devices.

Also developed a [version of the game entirely in MATLAB](https://github.com/baranusluel/2048-3d-matlab) as a proof-of-concept.

**Click the animation to play now!**
<br style="clear: right;">

### Mbed Pacman RPG: Embedded platform game, 2018

<iframe class="left-float-pic" style="margin-bottom: 20px" src="https://www.youtube.com/embed/NhTJ7zDlHBU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Designed a Pacman-themed [RPG game in C](https://github.com/baranusluel/mbed-pacman-rpg) for the ARM Mbed platform.
<br style="clear: left;">

<img class="right-float-pic" src="/assets/flight_vr.jpg">

### Flight VR: Virtual reality game, 2018

Created a Google Cardboard [VR game](https://github.com/baranusluel/flight-VR) with Unity.

This was submitted as a project for my freshman *English* class, believe it or not.
<br style="clear: right;">

### Catch-Bot: Operation Catapult project, 2016

<img class="left-float-pic" src="/assets/catchbot.png">

Led a team of 4 to build a robot that catches balls in the air.

Awarded **1st place for ‘Best Project’** out of 40 teams, at Rose-Hulman's
summer program for high school juniors. See the [final report](/assets/catchbot_report.pdf).

Implemented naive stereo vision algorithm with C++ and OpenCV, built control circuit and assisted with mechanical design.
<br style="clear: left;">
