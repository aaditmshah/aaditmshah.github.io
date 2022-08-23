---
title: "3 Reasons Why You Should Create Your Own ESLint Config"
tags:
  - eslint
  - eslint-config
  - ivory
---

I recently created my own eslint config called [Ivory](https://www.npmjs.com/package/eslint-config-ivory). It's my first open-source project. I decided that since I'm going to be a full-time open-source developer, I need to adhere to a single code style for all my repositories. So, why didn't I go with a popular eslint config like [Airbnb](https://github.com/airbnb/javascript)? Here are 3 reasons why I created my own eslint config, and why you should consider doing the same.

## 1. You Will Have Full Control Over Your Code Style

I'm a very opinionated software developer. For example, I prefer writing `for…of` loops over `.forEach`. However, the Airbnb eslint config disallows `for…of` loops. So, what's a developer supposed to do? Either you give in and use `.forEach`, or you explicitly override the rule.

Unfortunately, overriding a rule is not always as simple as turning it `"off"`. For example, the Airbnb eslint config uses the [`no-restricted-syntax`](https://eslint.org/docs/latest/rules/no-restricted-syntax) rule to disallow `for…of` loops. If you turn it `"off"` then you will inadvertently allow `for…in` loops, labels, and the `with` statement. Those are all things I want to disallow. Tweaking the rule to only allow `for…of` loops is complicated.

Now, though it might be complicated to tailor the Airbnb eslint config to suit your code style, it's nevertheless possible. But customized eslint configs suffer from another big problem — updates. Every time Airbnb updates its eslint config, there's a possibility that the updates might conflict with your code style. However, if you don't update then you skip out on configuring new rules.

All these problems can be avoided if you create your own eslint config. Since you have full control of the eslint config, there's no possibility of subverting your code style. Furthermore, you can set up automated tests and workflows to ensure that your eslint config is always consistent and up to date. For example, the [Alloy](https://github.com/AlloyTeam/eslint-config-alloy#philosophy) eslint config runs automated weekly checks for new rules added by eslint and its plugins. It also checks whether its rules conflict with [Prettier](https://prettier.io/) or are deprecated.

Sounds like a lot of work? It can indeed be daunting to create your own eslint config and manually configure all the rules to suit your code style. For example, I spent an entire 40-hour work week configuring all the rules in Ivory. But unlike me, you don't have to pay the cost upfront. You can create a fork of Ivory, start using it, and configure it over time to suit your code style.

## 2. You Will Have Consistency Across All Repositories

Creating your own eslint config does come at the significant cost of manually configuring all the rules. However, the benefit is that you only have to write the config once for all your repositories. For every new repository, you should only have to extend your eslint config. You should never have to override any rules, as that would make your code style inconsistent across repositories.

I know from experience that it's very easy for developers to create multiple repositories with inconsistent code styles. It's effortless for developers to override rules on a per-repository basis. Especially when you're working in a large organization with multiple teams. Using an external eslint config like Airbnb just encourages developers to override rules on a per-repository basis.

Now, inconsistent code styles would not be a major issue if eslint rules only enforced a stylistic preference, like `for…of` loops vs `.forEach`. However, a lot of eslint rules enforce a particular code style to prevent potential bugs. For example, I have a strong preference to ban type assertions in TypeScript by enabling the [`consistent-type-assertions`](https://typescript-eslint.io/rules/consistent-type-assertions) rule and setting the `assertionStyle` to `"never"`. This prevents a lot of bugs by forcing developers to fix errors reported by the type checker. If this code style was inconsistent across repositories then bugs may slip through.

When you create your own eslint config, you should discourage developers from overriding rules on a per-repository basis. Instead, you should encourage developers to raise an issue in your eslint config repository. This allows you to debate the proposed code style, update the eslint config in a disciplined manner, and most importantly maintain consistency across repositories.

## 3. You Can Have Customization With Preset Configs

While maintaining consistency across repositories is important, not all repositories require the same configuration rules. For example, you may only want to activate React rules for front-end applications. Fortunately, creating your own eslint config doesn't mean that you have to give up customization across repositories. You can have granular configs and combine them as required.

Breaking big things into smaller things and then recombining them to form the original thing is a common theme in computer science. Programmers know this concept by many names such as [dynamic programming](https://en.wikipedia.org/wiki/Dynamic_programming), the [combinator pattern](https://wiki.haskell.org/Combinator_pattern), and [decomposition](http://worrydream.com/LearnableProgramming/) and [recomposition](https://www.cs.kent.ac.uk/people/staff/dat/miranda/whyfp90.pdf). This technique has become popular in modern times. For example, the core concept of [Tailwind CSS](https://tailwindcss.com/), the most popular CSS framework, is combining simple style classes to build more complex styles.

The same concept can be applied to eslint configs. We already have a way of combining multiple eslint configs using the `extends` property. So, instead of creating a single monolithic eslint config, we can create multiple eslint configs at the level of granularity we desire. We can then combine them using the `extends` property into several preset configs for different kinds of repositories. The [Canonical](https://github.com/gajus/eslint-config-canonical#example-configuration) eslint config has some excellent examples on how to combine multiple configs.

## So Go Ahead and Create Your Own ESLint Config

Using a popular eslint config like Airbnb is easy when you want to get started as soon as possible. However, the return on investment sharply declines when you start overriding rules, copying your eslintrc file, and trying to maintain consistency across repositories. Having your own eslint config solves all these problems. And you don't need to start from scratch. Just fork [Ivory](https://www.npmjs.com/package/eslint-config-ivory) and get going.
