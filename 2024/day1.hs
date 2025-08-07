import System.IO
import Data.List (sort)
import qualified Data.Map as Map

main :: IO ()
main = do
    handle <- openFile "2024/day1.txt" ReadMode
    contents <- hGetContents handle
    let input = parseInput contents
    let dist = findDist input
    let sim = findSim input
    putStrLn $ "sim Score: " ++ show sim
    putStrLn $ show dist
    hClose handle

parseInput :: String -> [[Int]]
parseInput = map (map read . words) . lines

findDist :: [[Int]] -> Int
findDist input =
    let
        first = sort $ map (!! 0) input
        second = sort $ map (!! 1) input
    in
        sum $ zipWith (\a b -> abs (a - b)) first second

findSim :: [[Int]] -> Int
findSim input =
    let
        first = map (!! 0) input
        second = map (!! 1) input
        freqMap = foldl (\acc x -> Map.insertWith (+) x 1 acc) Map.empty second
    in
        sum $ map (\x -> x * Map.findWithDefault 0 x freqMap) first
