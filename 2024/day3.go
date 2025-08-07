package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"strings"
)

func addProducts(s string) int {
	s = "do()" + s // always start active
	segments := strings.Split(s, "don't()")
	sum := 0

	for _, segment := range segments {
		parts := strings.Split(segment, "do()")
		parts = parts[1:] // get rid of first deactivated instruction
		for _, part := range parts {
			re := regexp.MustCompile(`mul\(\d{1,3},\d{1,3}\)`)
			matches := re.FindAllStringSubmatch(part, -1)
			for _, m := range matches {
				re_num := regexp.MustCompile(`\d+`)
				nums := re_num.FindAllString(m[0], -1)
				a, errA := strconv.Atoi(nums[0])
				if errA != nil {
					log.Fatal(errA)
				}
				b, errB := strconv.Atoi(nums[1])
				if errB != nil {
					log.Fatal(errB)
				}
				sum += a * b
			}
		}
	}

	return sum
}

func main() {
	content, err := ioutil.ReadFile("../input.txt")
	if err != nil {
		log.Fatal(err)
	}

	inputs := string(content)
	sum := addProducts(inputs)
	fmt.Println(sum)
}
