/**
Name:Atticus Kaphaem
Date:11-06-26
Description:Lab 8
Bugs: None Known
Reflection: This lab was quite straightforward for the most part. The pearsons r formula looks intimidating but when you break it into smaller parts it's really not that bad to calculate.
SQL is human readable both for it's own good and it's own bad because I often found myself looking at slides for SQL guidance. 
I'm sure it'll make sense eventually but right now SQL just feels like very broken english in a sense. 
Anyways the pearsons r formula was quite fun to figure out once I realized you could break it down into smaller pieces.
*/

import dotenv from 'dotenv';
import pg from 'pg';

// Resolve .env beside this file, even when launched from another directory.
dotenv.config({ path: new URL('.env', import.meta.url), quiet: true });

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL in .env before running this demo.');
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

async function demoSelect() {

  try {
    const { rows } = await client.query(
      'SELECT * FROM movies',
    );

    for(let row of rows){
      console.log(rows);
    }

  } catch (error) {
    console.error('Supabase demo failed:', error.message);
    process.exitCode = 1;
  }
}

async function bornAfter(year){
  try{
    let bornAfterQuery = await client.query(`SELECT first_name, last_name FROM directors WHERE birth_year > $1 ORDER BY last_name`,[year]); //use SQL order by function to sort names and print them
    console.log(bornAfterQuery.rows)
  }catch(error){
    console.log("Database error!");
  }
}
/**
 * 
 * @param {} min_gross -minimum grossed movie
 * @param {*} max_gross -maximum grossed movie
 * @param {*} symbol -symbol to use
 */
async function gross(min_gross,max_gross,symbol){
  try{
    let curRottenTomatoesScore=0;
    let symbolString = "";
    let movieGrossQuery = await client.query(`SELECT name,rotten_tomatoes_score FROM movies WHERE gross_earnings > $1 AND gross_earnings < $2 `,[min_gross, max_gross]);
    for(const row of movieGrossQuery.rows){
      curRottenTomatoesScore = row.rotten_tomatoes_score; // gets the rottem tomatoes score from the current row 
      if(curRottenTomatoesScore > 0 && curRottenTomatoesScore < 20){ //adds the appropriate amount of symbols for each rating of 100/5
        symbolString = `${symbol}`;
      } else if(curRottenTomatoesScore >= 20 && curRottenTomatoesScore < 40){
        symbolString = `${symbol}${symbol}`;
      } else if(curRottenTomatoesScore >=40 && curRottenTomatoesScore < 60){
        symbolString = `${symbol}${symbol}${symbol}`;
      }else if(curRottenTomatoesScore >=60 && curRottenTomatoesScore < 80){
        symbolString = `${symbol}${symbol}${symbol}${symbol}`;
      } else if(curRottenTomatoesScore  >= 80 && curRottenTomatoesScore <= 100){
        symbolString = `${symbol}${symbol}${symbol}${symbol}${symbol}`;
      }
      console.log(`${row.name}, ${symbolString}`);//print the current rows name and it's symbol string

    }
  }catch(error){
    console.log("Database Error!")
  }
}
  
  /**
   * Calculates Pearsons r for the correlation coefficient between rotten tomatoes scores and gross earnings.
   */
  async function profitMatters(){
    let total_rotten_tomatoes_scores = [];
    let total_gross_earnings = [];
    let rawMovieData = await client.query("SELECT gross_earnings, rotten_tomatoes_score FROM movies");
    for(const row of rawMovieData.rows){
      total_rotten_tomatoes_scores.push(row.rotten_tomatoes_score);
      total_gross_earnings.push(Number(row.gross_earnings));  
    }

    let rottenTomatoesMean = calculateMean(total_rotten_tomatoes_scores);
    let grossEarningsMean = calculateMean(total_gross_earnings);

    let numerator = calculateNumerator(rottenTomatoesMean,grossEarningsMean,total_rotten_tomatoes_scores,total_gross_earnings)
    let denominator = calculateDenominatorPart(rottenTomatoesMean,total_rotten_tomatoes_scores) * calculateDenominatorPart(grossEarningsMean,total_gross_earnings); //mulitply the denominator parts together to make the denominator

    console.log(numerator/denominator); //print the final correlation coefficient by printing the numerator /denominator
  }
  /**
   * Updates the table to edit a movie
   * @param {*} movieId -id of the movie to edit
   * @param {*} rottenTomatoesScore - Rotten Tomatoes Score to update
   * @param {*} grossEarnings - gross earnings
   */
  async function changeMoviePerformance(movieId,rottenTomatoesScore,grossEarnings){
    await client.query("UPDATE movies SET rotten_tomatoes_score = $1, gross_earnings = $2 WHERE movie_id = $3",[rottenTomatoesScore,grossEarnings,movieId]);


  }
  /**
   * Calculates the mean of an Array
   * 
   * @param {*} arrayToCalculateMean - Array to calculate the mean of
   * @returns - mean of the array inputted
   */
  function calculateMean(arrayToCalculateMean){
    let summedArrayValues = 0;
    for(let i = 0; i < arrayToCalculateMean.length; i++){
      summedArrayValues += arrayToCalculateMean[i];
    }
    return summedArrayValues/arrayToCalculateMean.length;
  }
  /**
   * Calculates a part of the denominator to be calculated a s a product for Pearson's r
   * 
   * @param {*} mean - mean of the array part to calculate
   * @param {*} arrayToCalculate - array to calculate the denominator part for for pearson's r
   * @returns 
   */
  function calculateDenominatorPart(mean, arrayToCalculate){
    let summedDenominatorPart = 0;
      for(let i = 0; i < arrayToCalculate.length; i++){
        summedDenominatorPart += ((arrayToCalculate[i] - mean) ** 2);
      }
      return Math.sqrt(summedDenominatorPart);
  }
  /**
   * Calculates the numerator for pearsonrs r
   * @param {} firstArrayMean - mean of the first Array
   * @param {*} secondArrayMean  - mean of the second array
   * @param {*} firstArray -first array
   * @param {*} secondArray -second array
   * @returns 
   */
  function calculateNumerator(firstArrayMean, secondArrayMean, firstArray,secondArray){
    let totalSummedNumerator = 0;
    for(let i = 0; i < firstArray.length; i++){
      totalSummedNumerator += (firstArray[i] - firstArrayMean) * (secondArray[i] - secondArrayMean)
    }
    return totalSummedNumerator;
  }

  

await client.connect();
//await demoSelect();
await bornAfter(1960);
await gross(836800000.00,1440000000.00,'*')
await profitMatters();
await changeMoviePerformance(1,0,4);
await client.end();