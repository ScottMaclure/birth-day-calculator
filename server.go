// Basic local webserver to test out the static site before publishing.
package main

import (
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./docs")))
	http.ListenAndServe(":3000", nil)
}
