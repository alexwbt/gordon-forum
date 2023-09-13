const fn = (str) => {
    const vowels = ['a', 'e', 'i', 'o', 'u']
    let result = 0
    let tempVowelCounts = 0
    let consecutiveUniqueVowels = []
    str.split('').forEach(char => {
        const isVowel = !!vowels.includes(char)
        if (!isVowel) {
            tempVowelCounts = 0
            consecutiveUniqueVowels = []
            return
        }
        if (consecutiveUniqueVowels.length >= 5) {
            result++
            return
        } else {
            tempVowelCounts++
            const idx = consecutiveUniqueVowels.indexOf(char)
            if (idx !== -1) {
                consecutiveUniqueVowels = consecutiveUniqueVowels.slice(idx + 1)
            }
            consecutiveUniqueVowels.push(char)
            if (consecutiveUniqueVowels.length >= 5) {
                result += (tempVowelCounts - 4)
            }
        }
    })
    return result
}

const test = (arg) => {
    console.log(111, arg, fn(arg))
}

test('aeiou')
test('aeio')
test('aeioxa')
test('aeioxaeiouu')
test('aaeiouxaeiouu')
test('aaaeiouxaeiouu')
test('aaaeiouxeiouu')
test('aaaeiouxeiouuxaeiou')