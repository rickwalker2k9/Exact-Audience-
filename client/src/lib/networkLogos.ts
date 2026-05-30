// Exact Audience — TV Network & Streamer Logo Map
// Uses Google's favicon service (sz=128) which reliably returns icons for any domain.
// Falls back to colored initials badge in the UI if the image fails to load.

const G = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const NETWORK_LOGOS: Record<string, string> = {
  // ── Streaming Platforms ──────────────────────────────────────────────────
  "Samsung TV Plus":      G("samsungtvplus.com"),
  "Roku Channel":         G("roku.com"),
  "Tubi":                 G("tubi.tv"),
  "Pluto TV":             G("pluto.tv"),
  "Sling TV":             G("sling.com"),
  "DIRECTV":              G("directv.com"),
  "Peacock":              G("peacocktv.com"),
  "Hulu":                 G("hulu.com"),
  "Amazon Freevee":       G("amazon.com"),
  "Paramount+":           G("paramountplus.com"),
  "Discovery+":           G("discoveryplus.com"),
  "Max":                  G("max.com"),
  "fuboTV":               G("fubo.tv"),
  "Fubo TV":              G("fubo.tv"),
  "Philo":                G("philo.com"),
  "WatchFree+":           G("watchfree.vizio.com"),
  "Haystack":             G("haystack.tv"),
  "NewsON":               G("newson.us"),
  "Frndly TV":            G("frndlytv.com"),
  "Xumo":                 G("xumo.com"),
  "Plex":                 G("plex.tv"),
  "Crackle":              G("crackle.com"),
  "Kanopy":               G("kanopy.com"),
  "Stirr":                G("stirr.com"),

  // ── News Networks ────────────────────────────────────────────────────────
  "Fox News":             G("foxnews.com"),
  "CNN":                  G("cnn.com"),
  "MSNBC":                G("msnbc.com"),
  "NewsNation":           G("newsnation.com"),
  "CNBC":                 G("cnbc.com"),
  "Fox Business Network": G("foxbusiness.com"),
  "Bloomberg TV":         G("bloomberg.com"),
  "The Weather Channel":  G("weather.com"),
  "Court TV":             G("courttv.com"),
  "Newsmax":              G("newsmax.com"),
  "America's Voice":      G("americasvoice.news"),
  "OAN":                  G("oann.com"),
  "Epoch TV":             G("theepochtimes.com"),

  // ── Sports ───────────────────────────────────────────────────────────────
  "ESPN":                 G("espn.com"),
  "ESPN2":                G("espn.com"),
  "Golf Channel":         G("golfchannel.com"),
  "NFL Network":          G("nfl.com"),
  "CBS Sports":           G("cbssports.com"),
  "FS1":                  G("foxsports.com"),
  "NBC Sports":           G("nbcsports.com"),
  "MLB Network":          G("mlb.com"),
  "NBA TV":               G("nba.com"),
  "Tennis Channel":       G("tennischannel.com"),

  // ── Entertainment / Lifestyle ────────────────────────────────────────────
  "HGTV":                 G("hgtv.com"),
  "Food Network":         G("foodnetwork.com"),
  "TLC":                  G("tlc.com"),
  "Hallmark Channel":     G("hallmarkchannel.com"),
  "Lifetime":             G("mylifetime.com"),
  "A&E":                  G("aetv.com"),
  "History Channel":      G("history.com"),
  "HISTORY":              G("history.com"),
  "Discovery Channel":    G("discovery.com"),
  "National Geographic":  G("nationalgeographic.com"),
  "Animal Planet":        G("animalplanet.com"),
  "Bravo":                G("bravotv.com"),
  "E! Entertainment":     G("eonline.com"),
  "Comedy Central":       G("cc.com"),
  "MTV":                  G("mtv.com"),
  "VH1":                  G("vh1.com"),
  "BET":                  G("bet.com"),
  "OWN":                  G("oprah.com"),
  "Oxygen":               G("oxygen.com"),
  "Syfy":                 G("syfy.com"),
  "USA Network":          G("usanetwork.com"),
  "TNT":                  G("tntdrama.com"),
  "TBS":                  G("tbs.com"),
  "AMC":                  G("amc.com"),
  "FX":                   G("fxnetworks.com"),
  "FXX":                  G("fxnetworks.com"),
  "Travel Channel":       G("travelchannel.com"),
  "DIY Network":          G("diynetwork.com"),
  "Cooking Channel":      G("cookingchanneltv.com"),
  "Investigation Discovery": G("investigationdiscovery.com"),
  "ID":                   G("investigationdiscovery.com"),

  // ── Broadcast / Local ────────────────────────────────────────────────────
  "ABC":                  G("abc.com"),
  "NBC":                  G("nbc.com"),
  "CBS":                  G("cbs.com"),
  "FOX":                  G("fox.com"),
  "PBS":                  G("pbs.org"),
  "CW":                   G("cwtv.com"),
  "KOTV News on 6":       G("newson6.com"),
  "KOTV":                 G("newson6.com"),
  "News on 6":            G("newson6.com"),
  "KJRH":                 G("kjrh.com"),
  "KTUL":                 G("ktul.com"),
  "KOKI":                 G("fox23.com"),

  // ── Performance / Programmatic ───────────────────────────────────────────
  "Performance Network":  G("exactaudience.ai"),
  "DSP Display":          G("exactaudience.ai"),
};

/**
 * Returns the logo URL for a given network name, or null if not found.
 * The UI should render an initials badge as fallback when null or on img error.
 */
export function getNetworkLogo(name: string): string | null {
  return NETWORK_LOGOS[name] ?? null;
}
