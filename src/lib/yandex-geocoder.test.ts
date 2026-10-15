import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseYandexGeoResponse } from "./yandex-geocoder";

describe("Yandex Geocoder Service", () => {
  it("correctly parses standard Yandex Geocoder JSON response", () => {
    const mockResponse = {
      response: {
        GeoObjectCollection: {
          featureMember: [
            {
              GeoObject: {
                Point: {
                  pos: "69.6222 40.2833",
                },
                metaDataProperty: {
                  GeocoderMetaData: {
                    text: "Таджикистан, Согдийская область, Худжанд, проспект Исмоила Сомони, 45",
                    kind: "house",
                    precision: "exact",
                    Address: {
                      Components: [
                        { kind: "country", name: "Таджикистан" },
                        { kind: "province", name: "Согдийская область" },
                        { kind: "locality", name: "Худжанд" },
                        { kind: "street", name: "проспект Исмоила Сомони" },
                        { kind: "house", name: "45" },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      },
    };

    const results = parseYandexGeoResponse(mockResponse);
    assert.equal(results.length, 1);
    assert.equal(results[0].lat, 40.2833);
    assert.equal(results[0].lng, 69.6222);
    assert.equal(
      results[0].formattedAddress,
      "Таджикистан, Согдийская область, Худжанд, проспект Исмоила Сомони, 45"
    );
    assert.equal(results[0].city, "Худжанд");
    assert.equal(results[0].street, "проспект Исмоила Сомони");
    assert.equal(results[0].house, "45");
    assert.equal(results[0].kind, "house");
  });

  it("handles empty or invalid response gracefully", () => {
    assert.deepEqual(parseYandexGeoResponse(null), []);
    assert.deepEqual(parseYandexGeoResponse({}), []);
    assert.deepEqual(
      parseYandexGeoResponse({ response: { GeoObjectCollection: {} } }),
      []
    );
  });
});
