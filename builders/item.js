module.exports = class build {
    static item;
    static listing;

    static getListing(listingId) {
        let l = {};

        build.item.listing.forEach (listing => {
            if (listing._id === listingId) {
                l = listing;
            }
        });

        return l;
    }

    static availableQuantity() {
        return build.listing.count ? build.listing.count : 0;
    }

    static findCondition(subject) {
        const obj = build.listing.condition.find(c => c.subject === subject);

        return obj && obj.grade ? obj.grade : '';
    }

    static condition() {
        const obj = build.listing.condition.find(c => c.subject === 'item' || c.subject === 'disc' || !c.subject);

        return obj && obj.grade ? obj.grade : '';
    }

    static conditions() {
        return build.listing.condition.map(c => {
            let notes = c.notes.join(', ');

            if (notes.length) {
                notes = '- ' + notes;
            }
                return {
                    grade: c.grade === 'SS' ? 'Still Sealed' : c.grade,
                    subject: c.subject ? c.subject.charAt(0).toUpperCase() + c.subject.slice(1) : '',
                    notes: notes,
                }
        });
    }

    static artist() {
        if (build.item.release.artist.first) {
            return [ build.item.release.artist.first, build.item.release.artist.last ].join(' ');
        }

        return build.item.release.artist.last;
    }

    static title() {
        return build.item.release.titles.join(' / ');
    }

    static duration() {
        if (build.item.release.media) {
            return build.item.release.media[0].duration;
        }
    }

    static genre() {
        let itemGenre;

        build.item.release.genres.forEach(genre => {
            if (!genre.type && genre.name) {
                itemGenre = genre.name;
            }
        });

        return itemGenre;
    }

    static genres() {
        return build.item.release.genres.map(genre => genre.name);
    }

    static style() {
        let styles = [];

        for (let i in build.item.release.genres) {
            let genre = build.item.release.genres[i];

            if (genre.type && genre.type === 'style' && genre.name) {
                styles.push(genre.name);
            }
        }

        return styles.join(', ');
    }

    static speed() {
        if (build.item.release.media) {
            return `${build.item.release.media[0].speed} RPM`;
        }
    }

    static size() {
        if (build.item.release.media.length) {
            return `${build.item.release.media[0].size}"`;
        }
    }

    static releaseYear() {
        const obj = build.item.release.pressing.find(p => p.type === 'releaseYear');

        return obj && obj.text ? obj.text : '';
    }

    static edition() {
        return build.item.release.pressing.filter(pressing => {
            if (pressing.type === 'edition') {
                return pressing.text;
            }
        });
    }

    static pressing() {
        let pressings = {};

        build.item.release.pressing.forEach(p => {
            let type = p.type.charAt(0).toUpperCase() + p.type.slice(1);

            if (!pressings[type]) {
                pressings[type] = [];
            }

            pressings[type].push(p.text);
        });

        for (let type in pressings) {
            if (pressings.hasOwnProperty(type)) {
                pressings[type] = pressings[type].join(', ');
            }
        }

        return pressings;
    }

    static imageUrls() {
        return build.listing.images.map(image => {
            if (image.url) {
                return `${process.env.ITEM_IMAGE_PATH}/${image.url}`;
            }
        });
    }

    static clipUrls() {
        return build.listing.soundclips.map(clip => {
            if (clip.url) {
                return `${process.env.ITEM_CLIP_PATH}/${clip.url}`;
            }
        });
    }

    static notes() {
        let notes = [];

        build.item.notes.forEach(note => {
            if (!note.type) {
                notes.push(note.text);
            }
        });

        return notes;
    }

    static mediaSize() {
        return build.item.release.media[0].size === '12' ? 'large' : 'small';
    }

    static mediaTexts() {
        return build.item.release.media.map(item => {
            let countStr = item.count > 1 ? `${item.count} x ` : ``;

            let str = `${countStr}${item.size}" ${item.duration} (${item.speed} RPM)`;

            if (item.attributes && item.attributes.length) {
                str += ', ' + item.attributes.join(', ');
            }

            return str;
        })
    }
};