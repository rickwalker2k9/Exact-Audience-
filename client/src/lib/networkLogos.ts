// Exact Audience — TV Network & Streamer Logo Map
// Uses official CDN / Clearbit / favicon sources for each network.
// Falls back to colored initials badge in the UI if the image fails to load.

export const NETWORK_LOGOS: Record<string, string> = {
  // Streaming platforms
  "Samsung TV Plus":      "https://logo.clearbit.com/samsungtvplus.com",
  "Roku Channel":         "https://logo.clearbit.com/roku.com",
  "Tubi":                 "https://logo.clearbit.com/tubi.tv",
  "Pluto TV":             "https://logo.clearbit.com/pluto.tv",
  "Sling TV":             "https://logo.clearbit.com/sling.com",
  "DIRECTV":              "https://logo.clearbit.com/directv.com",
  "Peacock":              "https://logo.clearbit.com/peacocktv.com",
  "Hulu":                 "https://logo.clearbit.com/hulu.com",
  "Amazon Freevee":       "https://logo.clearbit.com/amazon.com",
  "Paramount+":           "https://logo.clearbit.com/paramountplus.com",
  "Discovery+":           "https://logo.clearbit.com/discoveryplus.com",
  "Max":                  "https://logo.clearbit.com/max.com",
  "Fubo TV":              "https://logo.clearbit.com/fubo.tv",
  "Philo":                "https://logo.clearbit.com/philo.com",

  // News networks
  "Fox News":             "https://logo.clearbit.com/foxnews.com",
  "CNN":                  "https://logo.clearbit.com/cnn.com",
  "MSNBC":                "https://logo.clearbit.com/msnbc.com",
  "NewsNation":           "https://logo.clearbit.com/newsnation.com",
  "CNBC":                 "https://logo.clearbit.com/cnbc.com",
  "Fox Business Network": "https://logo.clearbit.com/foxbusiness.com",
  "Bloomberg TV":         "https://logo.clearbit.com/bloomberg.com",
  "The Weather Channel":  "https://logo.clearbit.com/weather.com",
  "Court TV":             "https://logo.clearbit.com/courttv.com",
  "Newsmax":              "https://logo.clearbit.com/newsmax.com",

  // Sports
  "ESPN":                 "https://logo.clearbit.com/espn.com",
  "ESPN2":                "https://logo.clearbit.com/espn.com",
  "Golf Channel":         "https://logo.clearbit.com/golfchannel.com",
  "NFL Network":          "https://logo.clearbit.com/nfl.com",
  "CBS Sports":           "https://logo.clearbit.com/cbssports.com",
  "FS1":                  "https://logo.clearbit.com/foxsports.com",
  "NBC Sports":           "https://logo.clearbit.com/nbcsports.com",

  // Entertainment / Lifestyle
  "HGTV":                 "https://logo.clearbit.com/hgtv.com",
  "Food Network":         "https://logo.clearbit.com/foodnetwork.com",
  "TLC":                  "https://logo.clearbit.com/tlc.com",
  "Hallmark Channel":     "https://logo.clearbit.com/hallmarkchannel.com",
  "Lifetime":             "https://logo.clearbit.com/mylifetime.com",
  "A&E":                  "https://logo.clearbit.com/aetv.com",
  "History Channel":      "https://logo.clearbit.com/history.com",
  "Discovery Channel":    "https://logo.clearbit.com/discovery.com",
  "National Geographic":  "https://logo.clearbit.com/nationalgeographic.com",
  "Animal Planet":        "https://logo.clearbit.com/animalplanet.com",
  "Bravo":                "https://logo.clearbit.com/bravotv.com",
  "E! Entertainment":     "https://logo.clearbit.com/eonline.com",
  "Comedy Central":       "https://logo.clearbit.com/cc.com",
  "MTV":                  "https://logo.clearbit.com/mtv.com",
  "VH1":                  "https://logo.clearbit.com/vh1.com",
  "BET":                  "https://logo.clearbit.com/bet.com",
  "OWN":                  "https://logo.clearbit.com/oprah.com",
  "Oxygen":               "https://logo.clearbit.com/oxygen.com",

  // Broadcast / Local
  "ABC":                  "https://logo.clearbit.com/abc.com",
  "NBC":                  "https://logo.clearbit.com/nbc.com",
  "CBS":                  "https://logo.clearbit.com/cbs.com",
  "FOX":                  "https://logo.clearbit.com/fox.com",
  "PBS":                  "https://logo.clearbit.com/pbs.org",
  "KOTV News on 6":       "https://logo.clearbit.com/newson6.com",
  "KOTV":                 "https://logo.clearbit.com/newson6.com",
  "News on 6":            "https://logo.clearbit.com/newson6.com",
  "KJRH":                 "https://logo.clearbit.com/kjrh.com",
  "KTUL":                 "https://logo.clearbit.com/ktul.com",
  "KOKI":                 "https://logo.clearbit.com/fox23.com",
  "KQCW":                 "https://logo.clearbit.com/kqcw.com",

  // Performance / Programmatic
  "Performance Network":  "https://logo.clearbit.com/exactaudience.ai",
  "DSP Display":          "https://logo.clearbit.com/exactaudience.ai",
};

/**
 * Returns the logo URL for a given network name, or null if not found.
 * The UI should render an initials badge as fallback when null or on img error.
 */
export function getNetworkLogo(name: string): string | null {
  return NETWORK_LOGOS[name] ?? null;
}
