---
title: How I built a consistent Airbnb-style 3D icon system with ChatGPT JSON (Part 2)
description: The JSON style engine that locks AI renders into one visual family — subject in, sibling out.
publishedDate: 2025-09-09
categories:
  - Medium
theme: AI
tags:
  - AI
  - 3D Icons
  - JSON Prompting
canonicalUrl: "https://medium.com/design-bootcamp/how-i-built-a-consistent-airbnb-style-3d-icon-system-with-json-part-2-7ad582c915fc"
draft: false
---
Part 1 was the why. This is the how.

The how is a JSON file. Instead of re-describing the style in every prompt and hoping the model cooperates, I wrote it down once: camera angle, lighting rig, materials, color palette — all locked. The only thing that changes between renders is the subject.

That one move changes the workflow. Prompting an image model usually feels like rolling dice — sometimes you get the shot, mostly you don't. With the style locked in JSON, generation stops being a dice roll and starts behaving like a pipeline.

And the output passes the family test: line the icons up and they read as siblings. Not identical — siblings. Different subjects, same world.

The full article has the actual JSON script, plus how to hand it to ChatGPT so it learns the system before it renders anything. [Read the full piece on Medium →](https://medium.com/design-bootcamp/how-i-built-a-consistent-airbnb-style-3d-icon-system-with-json-part-2-7ad582c915fc)
