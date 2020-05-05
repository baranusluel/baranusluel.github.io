---
layout: page
title: About
permalink: /about
---

<div class="row">
<div class="column" style="padding: 0; margin: 0"><h1 style="margin: 0">About Me</h1></div>
<div class="column" style="text-align: right"><h3 style="margin: 0"><a href="/assets/BaranUsluel.CV.2020-03-30.long.pdf">Resume (PDF)</a></h3></div>
</div>

**Software engineer** and candidate for **BS in Electrical Engineering at Georgia Tech**,
with ~1 year of experience working on production software.

Technical skills include proficiency in **Java**, **C++** and **Python**, and familiarity with **PyTorch**.

Experience working on software for hardware products at **Qualcomm** and **Facebook AR/VR (Oculus)**.

Interested in working across the hardware/software stack in cutting-edge
robotics, perception and autonomous systems.

### Contact Me

<div class="row">
<div class="column-3">Feel free to reach me at:</div>
<div class="column-3" style="text-align: center"><code>me@baranusluel.com</code></div>
<div class="column-3" style="margin-top: -5px;">{%- include social.html -%}</div>
</div>

<!--<hr>

<nav role="navigation">
  <ul>
    <li><a href="#experience">Experience</a></li>
    <li><a href="#education">Education</a></li>
    <li><a href="#projects">Projects</a></li>
  </ul>
</nav>-->

<hr>

<h2><a name="experience" class="hidden-link">Experience</a></h2>

### Facebook

<img class="left-float-pic" src="/assets/fb_pic.jpg"/>

Interned at Facebook in Menlo Park during Summer 2019, on the Oculus VR OS team.

Developed automated audio test framework with **Java (JNI)** and **C++** for AOSP-based standalone Oculus VR devices.

Performed bring-up of a system service, assisted in developing a new **AOSP HAL** and implemented the first E2E tests for an **innovative, high-impact** audio feature.
<br style="clear: left;">

### Qualcomm

<img class="right-float-pic" src="/assets/qc_pic.jpg"/>

Interned at Qualcomm in San Diego during Summer 2018, on Snapdragon Display Test team.

Developed an Android app with **Java** for display software testing, which ran **400+ existing** Lua tests and **100+ new** tests.

Increased speed of developer-level tests **2.5x**, resulting in active use by **30+** display software developers.
<br style="clear: right;">

### Georgia Institute of Technology

As an Undergraduate Teaching Assistant, taught introductory computing and MATLAB to **200 students** personally over four semesters.

Created an [automatic homework grader](https://github.com/CS1371/autograder) suite as the Lead Developer of an agile software development team with 8 other TAs.

Enabled the course’s migration to a new CMS by developing a critical data conversion utility in MATLAB.

### Freelance Software Development

Picked up freelance web and Java development jobs during high school.

Developed and maintained **3 websites** for the clients of a local advertising & PR company (ADD PR Design). Designed responsive themes for WordPress CMS with PHP, HTML, CSS and Javascript.

Built plugins for commercial Minecraft server networks using Java and the Bukkit API to add new gameplay functionality. Wrote **100+** Java plugins (**25,000+ lines**) in total, for clients and as open-source projects ([one with 750,000 downloads](https://github.com/baranusluel/bukkit-simpleprefix)).

<hr>

<h2><a name="education" class="hidden-link">Education</a></h2>

### Georgia Institute of Technology

Studying for a Bachelor of Science in **Electrical Engineering**, with a minor in **Computer Science** (**Artificial Intelligence** concentration).

Expecting to graduate **December 2021**.

**Relevant Coursework:** Deep Learning, Computer Vision, Robotics & Perception, Machine Learning, Advanced Programming Techniques, Cryptographic Hardware for Embedded Systems, Programming HW/SW Systems

**Extracurriculars:** GT Chamber Choir, RoboJackets (Intelligent Ground Vehicle Competition, Electrical Team), Wreck Racing, Intramural Soccer & Ultimate Frisbee, Tech Treks Alaska.

**Certifications:** American Red Cross First Aid/CPR/AED, PADI Open Water Scuba Diver *(in progress)*.

<hr>

<h2><a name="projects" class="hidden-link">Projects</a></h2>

### Resisting Adversarial Attacks by k-WTA

<img class="left-float-pic" style="margin-bottom: 20px;" src="/assets/kwta_relu.JPG">

Demonstrated reproducibility of empirical results of ICLR 2020 paper *"Enhancing Adversarial Defense by k-Winners-Take-All"* (Xiao et al.).

Utilized **PyTorch** to replace ReLU activations in well-known deep model architectures with the k-WTA activation function, and test performance under several white-box attacks.

Discovered a significant performance overhead not mentioned in the original work, and proposed a workaround to improve training time.

See our [final report](https://github.com/baranusluel/kWTA-activation/raw/master/CS7643_Final_Report.pdf) and our [project repo](https://github.com/baranusluel/kWTA-activation).
<br style="clear: left;">

### Sentiment Analysis with CNNs

<img class="right-float-pic" style="height: 150px; width: auto" src="/assets/sentiment_wordcloud.png">

Trained a deep convolutional neural network with **Keras** to perform sentiment analysis on movie reviews using word2vec embeddings.

Achieved a test accuracy of 71% on the Bo Pang et al. movie review 'scale dataset v1.0'.

See our [final report](https://baranusluel.com/sentiment-cnn/) as a Github Page.
<br style="clear: right;">

### Autoknoby | HackMobile project

<iframe class="left-float-pic" style="margin-bottom: 30px" src="https://www.youtube.com/embed/xL6oJc1dAVI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Led a team making [an IoT facial-recognition system](https://github.com/baranusluel/autoknoby) at Qualcomm's Intern Hackathon. Awarded **‘Most Innovative Hack’** and ‘Top 10 Best Hack’ from 60 teams.

Leveraged Python and OpenCV for facial detection, with Microsoft’s Face API for recognition, on a DragonBoard 410c.
<br style="clear: left;">

<a href="https://2048.baranusluel.com/"><img class="right-float-pic" src="/assets/2048_3d.gif"></a>
### 2048 3D | Mobile and web game

Developed a [fully 3D version](https://github.com/baranusluel/2048-3d) of the popular 2048 game using Unity and C#, for web and Android (Google Play) devices.

Also developed [a version of the game](https://github.com/baranusluel/2048-3d-matlab) entirely in MATLAB as a proof-of-concept.

*Click the animation to play now!*
<br style="clear: right;">

### Mbed Pacman RPG | Embedded platform game

<iframe class="left-float-pic" style="margin-bottom: 30px" src="https://www.youtube.com/embed/NhTJ7zDlHBU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Designed a Pacman-themed [RPG game in C](https://github.com/baranusluel/mbed-pacman-rpg) for the ARM Mbed platform.
<br style="clear: left;">

<img class="right-float-pic" src="/assets/flight_vr.jpg">
### Flight VR | Virtual reality game

Created a Google Cardboard [VR game](https://github.com/baranusluel/flight-VR) with Unity.

This was submitted as a project for my *English* class, believe it or not.
<br style="clear: right;">

### Catch-Bot | Operation Catapult project

<img class="left-float-pic" src="/assets/catchbot.png">

Led a team of 4 to build a robot that catches balls in the air.

Awarded 1st place for ‘Best Project’ out of 40 teams, at Rose-Hulman's
summer program for high school juniors. See the [final report](/assets/catchbot_report.pdf).

Implemented naive stereo vision algorithm with C++ and OpenCV, built control circuit and assisted with mechanical design.
<br style="clear: left;">
