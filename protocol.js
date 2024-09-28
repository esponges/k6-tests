import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';
import http from 'k6/http';
import {parseHTML} from "k6/html";

export const options = {
  scenarios: {
    // browser: {
    //   executor: 'constant-vus',
    //   exec: 'browserTest',
    //   vus: 1,
    //   duration: '10s',
    //   options: {
    //     browser: {
    //       type: 'chromium',
    //     },
    //   },
    // },
    news: {
      executor: 'constant-vus',
      exec: 'news',
      vus: 1,
      duration: '10s',
    },
  },
};

export async function browserTest() {
  const page = await browser.newPage();

  try {
    await page.goto('https://test.k6.io/browser.php');

    await page.locator('#checkbox1').check();

    await check(page.locator('#checkbox-info-display'), {
      'checkbox is checked': async lo =>
        await lo.textContent() === 'Thanks for checking the box'
    });
  } finally {
    await page.close();
  }
}

// https://fer-toasted.vercel.app/_next/static/chunks/218-6c2b771e87965a9f.js
// https://fer-toasted.vercel.app/_next/static/chunks/846-7041a33c55703e6d.js
// https://fer-toasted.vercel.app/_next/static/chunks/app/layout-c34bff7604c2ad53.js

const ASSETS = [
  '/_next/static/chunks/218-6c2b771e87965a9f.js',
  '/_next/static/chunks/846-7041a33c55703e6d.js',
  '/_next/static/chunks/app/layout-c34bff7604c2ad53.js',
];

const CDN_BASE_URL = 'https://fer-toasted.vercel.app';

export function news() {
  const requests = ASSETS.map(asset => ({
    method: 'GET',
    url: `${CDN_BASE_URL}${asset}`,
  }));

  const responses = http.batch(requests);

  responses.forEach((res, index) => {
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}
