import { rm } from 'fs/promises';
import { join } from 'path';

// to run this code, everytime before any of the test suite runs, we have added code in the "jest-e2e.json" file
// here it will delete the test.sqlite file before any of the test runs.
// we left catch block empty because if there is no file named test.sqlite then it will throw an error
// we have no problem if test.sqlite doesn't exist, so we don't want any error for that case.
// that is why we left the catch block empty

global.beforeEach(async() => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) { }
});